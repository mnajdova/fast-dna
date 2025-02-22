import {
    ComponentProps,
    ExplorerHandledProps,
    ExplorerProps,
    ExplorerState,
    Theme,
    ThemeName,
} from "./explorer.props";
import { CodePreviewChildOption } from "@microsoft/fast-tooling-react/dist/data-utilities/mapping";
import { camelCase, get, memoize, merge } from "lodash-es";
import {
    Canvas,
    CanvasClassNamesContract,
    Container,
    Pane,
    PaneResizeDirection,
    Row,
    RowResizeDirection,
} from "@microsoft/fast-layouts-react";
import {
    defaultDevices,
    Form,
    mapDataToCodePreview,
    NavigationMenu,
    Viewer,
    ViewerClassNameContract,
} from "@microsoft/fast-tooling-react";
import manageJss, { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import ReactDOM from "react-dom";
import React from "react";
import { downChevron, upChevron } from "./icons/chevrons";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    applyCornerRadius,
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
    designUnit,
    horizontalSpacing,
    neutralDividerRest,
    neutralLayerL1,
    neutralLayerL2,
    neutralLayerL3,
    outlineWidth,
} from "@microsoft/fast-components-styles-msft";
import {
    LabelClassNameContract,
    ListboxItemProps,
    TabsItem,
    TypographyClassNameContract,
    TypographySize,
} from "@microsoft/fast-components-react-base";
import style, { applyScrollbarStyle } from "./explorer.style";
import {
    ActionToggle,
    ActionToggleAppearance,
    ActionToggleClassNameContract,
    ActionToggleProps,
    Background,
    Heading,
    HeadingSize,
    Label,
    Pivot,
    PivotClassNameContract,
    Select,
    SelectClassNameContract,
    SelectOption,
    Toggle,
    ToggleClassNameContract,
    Typography,
} from "@microsoft/fast-components-react-msft";
import {
    FormChildOptionItem,
    FormClassNameContract,
} from "@microsoft/fast-tooling-react/dist/form/form";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import syntaxHighlighterStyles from "./syntax-highlighting-style";
import { childOptions, history, menu } from "./config";
import * as componentViewConfigs from "./utilities/configs";
import { Scenario } from "./utilities/configs/data.props";
import { MemoizedFunction, uniqueId } from "lodash";
import { Direction } from "@microsoft/fast-web-utilities";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import { format, multiply, toPx } from "@microsoft/fast-jss-utilities";
import { NavigationMenuClassNameContract } from "@microsoft/fast-tooling-react/dist/navigation-menu/navigation-menu.style";

const dark: string = `#333333`;
const light: string = "#FFFFFF";

class Explorer extends Foundation<ExplorerHandledProps, {}, ExplorerState> {
    public static displayName: string = "Explorer";

    protected handledProps: HandledProps<ExplorerHandledProps> = {
        managedClasses: void 0,
    };

    private viewerContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private viewerContentAreaPadding: number = 20;

    private canvasStyleOverrides: ComponentStyleSheet<
        CanvasClassNamesContract,
        DesignSystem
    > = {
        canvas: {
            display: "flex",
            flexDirection: "column",
        },
    };

    private viewerStyleOverrides: (
        background: string
    ) => ComponentStyleSheet<Partial<ViewerClassNameContract>, DesignSystem> = memoize(
        (
            background: string
        ): ComponentStyleSheet<Partial<ViewerClassNameContract>, DesignSystem> => ({
            viewer: {
                minHeight: "unset",
                width: "fit-content",
            },
            viewer_iframe: {
                backgroundColor: background,
                ...applyCornerRadius(),
            },
        })
    );

    private formStyleOverrides: ComponentStyleSheet<
        Partial<FormClassNameContract>,
        DesignSystem
    > = {
        form: {
            height: "unset",
            background: "unset",
            paddingRight: "12px",
        },
    };

    private navigationMenuStyleOverrides: ComponentStyleSheet<
        Partial<NavigationMenuClassNameContract>,
        DesignSystem
    > = {
        navigationMenu: {
            background: "unset",
        },
        navigationMenuItem: {
            textIndent: "0",
        },
        navigationMenuItem_listItem: {
            paddingLeft: "10px",
        },
    };

    private pivotStyleOverrides: ComponentStyleSheet<
        Partial<PivotClassNameContract>,
        DesignSystem
    > = {
        pivot: {
            height: "100%",
            boxSizing: "border-box",
        },
        pivot_tabList: {
            padding: format("{0} {1}", toPx(designUnit), toPx(multiply(designUnit, 2))),
        },
        pivot_activeIndicator: {
            top: "23px",
        },
        pivot_tabPanelContent: {
            padding: format("{0} {1}", toPx(designUnit), toPx(multiply(designUnit, 2))),
        },
        pivot_tabPanels: {
            overflow: "auto",
            height: "calc(100% - 32px)",
            borderTop: format<DesignSystem>(
                "{0} solid {1}",
                neutralDividerRest,
                toPx(outlineWidth)
            ),
            ...applyScrollbarStyle(),
        },
    };

    private devToolsToggleStyles: ComponentStyleSheet<
        ActionToggleClassNameContract,
        DesignSystem
    > = {
        actionToggle: {
            position: "absolute",
            top: toPx(designUnit),
            right: toPx(multiply(designUnit, 2)),
        },
    };

    private toggleStyleOverrides: ComponentStyleSheet<
        Partial<ToggleClassNameContract>,
        DesignSystem
    > = {
        toggle_toggleButton: {
            display: "flex",
        },
    };

    private labelStyleOverrides: ComponentStyleSheet<
        Partial<LabelClassNameContract>,
        DesignSystem
    > = {
        label: {
            margin: format("0 {0} 0 {1}", toPx(designUnit), horizontalSpacing()),
        },
    };

    private selectStyleOverrides: ComponentStyleSheet<
        Partial<SelectClassNameContract>,
        DesignSystem
    > = {
        select: {
            marginRight: "auto",
            zIndex: "1",
        },
    };

    private resolveSchemaById: ((id: string) => any) & MemoizedFunction;

    constructor(props: ExplorerProps) {
        super(props);

        const locationPathname: string = get(this.props, "location.pathname", "");

        this.resolveSchemaById = memoize(this.getSchemaById);

        this.state = {
            dataLocation: "",
            width: 0,
            height: 0,
            scenario: this.getScenarioData(
                this.getComponentNameSpinalCaseByPath(locationPathname)
            ),
            locationPathname,
            theme: ThemeName.light,
            viewConfig: DesignSystemDefaults,
            devToolsVisible: true,
        };
    }

    public render(): React.ReactNode {
        if (typeof get(this.state, "scenario.id") === "undefined") {
            return (
                <div>
                    <h1>404 - This page does not exist</h1>
                    <a href={"/"}>Go to a valid page</a>
                </div>
            );
        }

        return (
            <Background value={neutralLayerL1}>
                <Container className={get(this.props, "managedClasses.explorer")}>
                    <Row style={{ flex: "1" }}>
                        <Pane
                            className={get(
                                this.props,
                                "managedClasses.explorer_navigationPanel"
                            )}
                            resizable={true}
                            resizeFrom={PaneResizeDirection.east}
                        >
                            <Background value={neutralLayerL3} drawBackground={false}>
                                <div
                                    className={get(
                                        this.props,
                                        "managedClasses.explorer_paneTitleContainer"
                                    )}
                                >
                                    <Heading size={HeadingSize._6}>FAST Explorer</Heading>
                                </div>
                                <NavigationMenu
                                    menu={menu}
                                    expanded={true}
                                    activeLocation={this.state.locationPathname}
                                    onLocationUpdate={this.handleUpdateRoute}
                                    jssStyleSheet={this.navigationMenuStyleOverrides}
                                />
                            </Background>
                        </Pane>
                        <Canvas jssStyleSheet={this.canvasStyleOverrides}>
                            <Row fill={true}>
                                <div style={{ overflow: "auto", width: "100%" }}>
                                    <Background
                                        value={neutralLayerL2}
                                        className={get(
                                            this.props,
                                            "managedClasses.explorer_toolbar"
                                        )}
                                    >
                                        {this.renderScenarioSelect()}
                                        {this.renderThemeToggle()}
                                        {this.renderDirectionToggle()}
                                        {this.renderAccentColorPicker()}
                                    </Background>
                                    <div
                                        ref={this.viewerContainerRef}
                                        className={get(
                                            this.props,
                                            "managedClasses.explorer_viewerRegion"
                                        )}
                                    >
                                        <div
                                            style={{
                                                padding: toPx(
                                                    this.viewerContentAreaPadding
                                                ),
                                                minWidth: "fit-content",
                                            }}
                                        >
                                            {this.renderViewer()}
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            <Row
                                resizable={true}
                                resizeFrom={RowResizeDirection.north}
                                initialHeight={400}
                                collapsedHeight={32}
                                collapsed={!this.state.devToolsVisible}
                            >
                                <Background
                                    value={neutralLayerL2}
                                    className={get(
                                        this.props,
                                        "managedClasses.explorer_devToolsPanel"
                                    )}
                                >
                                    <Pivot
                                        label={"documentation"}
                                        items={this.renderPivotItems()}
                                        jssStyleSheet={this.pivotStyleOverrides}
                                    />
                                    <ActionToggle
                                        appearance={ActionToggleAppearance.stealth}
                                        selectedLabel={"Development tools expanded"}
                                        selectedGlyph={downChevron}
                                        unselectedLabel={"Development tools collapsed"}
                                        unselectedGlyph={upChevron}
                                        selected={this.state.devToolsVisible}
                                        jssStyleSheet={this.devToolsToggleStyles}
                                        onToggle={this.handleDevToolsToggle}
                                    />
                                </Background>
                            </Row>
                        </Canvas>
                        <Pane
                            className={get(
                                this.props,
                                "managedClasses.explorer_propertiesPanel"
                            )}
                            resizable={true}
                            resizeFrom={PaneResizeDirection.west}
                        >
                            <Background value={neutralLayerL3}>
                                <div
                                    className={get(
                                        this.props,
                                        "managedClasses.explorer_paneTitleContainer"
                                    )}
                                >
                                    <Heading size={HeadingSize._6}>Properties</Heading>
                                </div>
                                {this.renderForm()}
                            </Background>
                        </Pane>
                    </Row>
                </Container>
            </Background>
        );
    }

    public componentDidMount(): void {
        this.setViewerToFullSize();
    }

    private setViewerToFullSize(): void {
        const viewerContainer: HTMLDivElement | null = this.viewerContainerRef.current;

        if (viewerContainer) {
            const viewerNode: Element | Text | null = ReactDOM.findDOMNode(
                viewerContainer
            );

            if (viewerNode instanceof Element) {
                const height: number =
                    viewerNode.clientHeight - this.viewerContentAreaPadding * 2;
                const width: number =
                    viewerNode.clientWidth - this.viewerContentAreaPadding * 2;
                this.setState({
                    width,
                    height,
                });
            }
        }
    }

    private renderViewer(): React.ReactNode {
        return (
            <Viewer
                iframeSrc={"/preview"}
                iframePostMessage={this.state.viewConfig}
                width={this.state.width}
                height={this.state.height}
                onUpdateHeight={this.handleUpdateHeight}
                onUpdateWidth={this.handleUpdateWidth}
                viewerContentProps={this.state.scenario}
                responsive={true}
                jssStyleSheet={this.viewerStyleOverrides(
                    get(this.state, "viewConfig.backgroundColor")
                )}
            />
        );
    }

    private renderForm(): React.ReactNode {
        const schema: any = this.resolveSchemaById(get(this.state.scenario, "id"));

        if (typeof schema !== "undefined") {
            return (
                <Form
                    data={get(this.state.scenario, "props")}
                    onChange={this.handleUpdateData}
                    schema={schema}
                    location={{
                        onChange: this.handleUpdateLocation,
                        dataLocation: this.state.dataLocation,
                    }}
                    childOptions={childOptions}
                    jssStyleSheet={this.formStyleOverrides}
                />
            );
        }
    }

    private renderAccentColorPicker(): React.ReactNode {
        const id: string = uniqueId("accent-color-picker");
        return (
            <div
                className={get(this.props, "managedClasses.explorer_viewerControlRegion")}
            >
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    Accent color
                </Label>
                <input
                    type={"color"}
                    id={id}
                    className={get(this.props, "managedClasses.explorer_colorPicker")}
                    value={this.state.viewConfig.accentBaseColor}
                    onChange={this.handleAccentColorPickerChange}
                />
            </div>
        );
    }

    private renderDirectionToggle(): React.ReactNode {
        const id: string = uniqueId("direction");
        return (
            <div
                className={get(this.props, "managedClasses.explorer_viewerControlRegion")}
            >
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    RTL
                </Label>
                <Toggle
                    jssStyleSheet={this.toggleStyleOverrides}
                    inputId={id}
                    onClick={this.handleUpdateDirection}
                    selectedMessage={""}
                    unselectedMessage={""}
                    statusMessageId={"direction"}
                />
            </div>
        );
    }

    private renderThemeToggle(): React.ReactNode {
        const id: string = uniqueId("theme");
        return (
            <div
                className={get(this.props, "managedClasses.explorer_viewerControlRegion")}
            >
                <Label jssStyleSheet={this.labelStyleOverrides} htmlFor={id}>
                    Dark mode
                </Label>
                <Toggle
                    jssStyleSheet={this.toggleStyleOverrides}
                    inputId={id}
                    onClick={this.handleUpdateTheme}
                    selectedMessage={""}
                    unselectedMessage={""}
                    statusMessageId={"theme"}
                />
            </div>
        );
    }

    private renderPivotItems(): TabsItem[] {
        return [
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handleDevToolsTabTriggerClick}
                        >
                            Code Preview
                        </Typography>
                    );
                },
                content: (className: string): React.ReactNode => {
                    return (
                        <div className={className}>
                            <SyntaxHighlighter
                                language="jsx"
                                style={syntaxHighlighterStyles}
                            >
                                {this.getCodePreview()}
                            </SyntaxHighlighter>
                        </div>
                    );
                },
                id: "codePreview",
            },
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handleDevToolsTabTriggerClick}
                        >
                            Guidance
                        </Typography>
                    );
                },
                content: (className: string): React.ReactNode => {
                    const componentName: string = this.getComponentNameSpinalCaseByPath(
                        this.state.locationPathname
                    );
                    const Guidance: React.ComponentClass = get(
                        componentViewConfigs,
                        `${camelCase(componentName)}Config.guidance`,
                        null
                    );

                    return (
                        <div className={className}>
                            <Guidance />
                        </div>
                    );
                },
                id: "guidance",
            },
            {
                tab: (className: string): React.ReactNode => {
                    return (
                        <Typography
                            className={className}
                            size={TypographySize._8}
                            onClick={this.handleDevToolsTabTriggerClick}
                        >
                            Schema
                        </Typography>
                    );
                },
                content: (className: string): React.ReactNode => {
                    const schema: any = this.resolveSchemaById(
                        get(this.state.scenario, "id")
                    );

                    if (typeof schema !== "undefined") {
                        return (
                            <div className={className}>
                                <pre>{JSON.stringify(schema, null, 2)}</pre>
                            </div>
                        );
                    }
                },
                id: "schema",
            },
        ];
    }

    private renderScenarioSelect(): React.ReactNode {
        const componentName: string = this.getComponentNameSpinalCaseByPath(
            this.state.locationPathname
        );
        const scenarioOptions: Array<Scenario<any>> = get(
            componentViewConfigs[`${camelCase(componentName)}Config`],
            "scenarios"
        );

        if (Array.isArray(scenarioOptions)) {
            return (
                <Select
                    jssStyleSheet={this.selectStyleOverrides}
                    onValueChange={this.handleUpdateScenario}
                    defaultSelection={[scenarioOptions[0].displayName]}
                >
                    {this.renderScenarioOptions(scenarioOptions)}
                </Select>
            );
        }
    }

    private renderScenarioOptions(
        scenarioOptions: Array<Scenario<any>>
    ): React.ReactNode {
        return scenarioOptions.map((scenarioOption: Scenario<any>, index: number) => {
            return (
                <SelectOption
                    key={index}
                    id={scenarioOption.displayName}
                    displayString={scenarioOption.displayName}
                    value={`${index}`}
                />
            );
        });
    }

    private getComponentNameSpinalCaseByPath(path: string): string {
        const paths: string[] = path.split("/");
        return paths[paths.length - 1];
    }

    private getSchemaById(id: string): any | void {
        const childOption: FormChildOptionItem | void = childOptions.find(
            (componentOption: any): any => {
                return get(componentOption, "schema.id") === id;
            }
        );

        if (typeof childOption !== "undefined") {
            return get(childOption, "schema");
        }
    }

    private getCodePreview(): string | null {
        return typeof this.state.scenario !== "undefined" &&
            Array.isArray(childOptions) &&
            childOptions.length > 0
            ? mapDataToCodePreview({
                  data: this.state.scenario,
                  childOptions: childOptions as CodePreviewChildOption[],
              })
            : null;
    }

    private getScenarioData<T>(
        componentName: string,
        index?: number
    ): ComponentProps<T> | void {
        // cloning when the scenario data is fetched as there appears to be
        // a mutation happening in one of the Form
        return {
            id: get(
                componentViewConfigs[`${camelCase(componentName)}Config`],
                "schema.id"
            ),
            props:
                typeof index === "number"
                    ? get(
                          componentViewConfigs,
                          `${camelCase(componentName)}Config.scenarios[${index}].data`,
                          {}
                      )
                    : get(
                          componentViewConfigs,
                          `${camelCase(componentName)}Config.scenarios[0].data`,
                          {}
                      ),
        };
    }

    private handleUpdateDirection = (): void => {
        this.setState({
            viewConfig: Object.assign({}, this.state.viewConfig, {
                direction:
                    this.state.viewConfig.direction === Direction.ltr
                        ? Direction.rtl
                        : Direction.ltr,
            }),
        });
    };

    private handleUpdateScenario = (
        newValue: string | string[],
        selectedItems: ListboxItemProps[],
        displayString: string
    ): void => {
        this.setState({
            scenario: this.getScenarioData(
                this.getComponentNameSpinalCaseByPath(this.state.locationPathname),
                parseInt(selectedItems[0].value, 10)
            ),
        });
    };

    private handleUpdateData = (data: any): void => {
        this.setState({
            scenario: {
                id: get(this.state.scenario, "id"),
                props: data,
            },
        });
    };

    private handleUpdateHeight = (updatedHeight: number): void => {
        this.setState({
            height: updatedHeight,
        });
    };

    private handleUpdateWidth = (updatedWidth: number): void => {
        this.setState({
            width: updatedWidth,
        });
    };

    private handleUpdateLocation = (dataLocation: string): void => {
        this.setState({
            dataLocation,
        });
    };

    private handleUpdateRoute = (route: string): void => {
        this.setState(
            {
                locationPathname: route,
                scenario: this.getScenarioData(
                    this.getComponentNameSpinalCaseByPath(route)
                ),
            },
            () => {
                history.push(route);
            }
        );
    };

    private handleUpdateTheme = (): void => {
        const isLightTheme: boolean = this.state.theme === ThemeName.light;
        const updatedThemeColor: string = isLightTheme ? dark : light;
        this.setState({
            theme: isLightTheme ? ThemeName.dark : ThemeName.light,
            viewConfig: merge({}, this.state.viewConfig, {
                backgroundColor: updatedThemeColor,
            }),
        });
    };

    /**
     * Event handler for all color input changes
     */
    private handleAccentColorPickerChange = (
        e: React.FormEvent<HTMLInputElement>
    ): void => {
        const value: string = e.currentTarget.value;
        const accentPaletteSource: ColorRGBA64 | null = parseColor(value);
        if (accentPaletteSource !== null) {
            const palette: string[] = createColorPalette(accentPaletteSource);
            this.setState({
                viewConfig: merge({}, this.state.viewConfig, {
                    accentBaseColor: value.toUpperCase(),
                    accentPalette: palette,
                }),
            });
        }
    };

    private handleDevToolsToggle = (
        e: React.MouseEvent<HTMLButtonElement>,
        props: ActionToggleProps
    ): void => {
        this.setState({
            devToolsVisible: !props.selected,
        });
    };

    private handleDevToolsTabTriggerClick = (e: React.MouseEvent<unknown>): void => {
        if (!this.state.devToolsVisible) {
            this.setState({
                devToolsVisible: true,
            });
        }
    };
}

export default manageJss(style)(Explorer);

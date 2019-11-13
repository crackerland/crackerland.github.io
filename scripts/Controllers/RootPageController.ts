import { View, FileLoader } from "/web_modules/ts-libs.js"
import { Lazy } from "../Core/Lazy/Lazy.js"
import { RootViewModel } from "../ViewModels/RootViewModel.js"

// jQuery and especially dropify are JS librarys that don't play nice with Typescript.
// This is a bit of a hack to make the dropify extention work with jQuery.
declare var $: any

export class RootPageController {
    private readonly ViewFile = "RootPage.html"
    private readonly element: Lazy<Promise<Element>>
    private readonly viewModel: RootViewModel;
    private readonly loader: FileLoader;

    constructor(loader: FileLoader, viewModel: RootViewModel) {
        this.loader = loader
        this.viewModel = viewModel
        this.element = Lazy.create(async () => await View.create(this.ViewFile, loader).load())
    }

    async loadIntoParent(parent: HTMLElement): Promise<void> {
        let element = await this.element.Value
        parent.appendChild(element)

        $('.dropify').dropify()

        let filePicker = element.querySelector(".dropify") as HTMLInputElement
        filePicker.addEventListener("change", e => this.viewModel.readFile(((e.target as any)["files"] as FileList)[0]))

        let tabs = element.querySelector(".tabs") as HTMLUListElement
        M.Tabs.init(tabs)

        //let editorTabContent = element.querySelector("div[id='edit'") as HTMLDivElement
        //new EditorPageController(this.loader, this.viewModel.editorViewModel)
        //    .loadIntoParent(editorTabContent);

        //let viewerTabContent = element.querySelector("div[id='view'") as HTMLDivElement
        //new ViewerPageController(this.viewModel.viewerViewModel)
        //    .loadIntoParent(viewerTabContent)
    }
}
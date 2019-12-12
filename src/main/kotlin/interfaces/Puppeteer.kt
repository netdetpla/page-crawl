package interfaces

import kotlin.js.Promise

@Suppress("FunctionName")
@JsModule("puppeteer")
external object Puppeteer {

    class Page {

        fun goto(url: String, options: dynamic): Promise<dynamic>

        fun waitFor(element: String, options: dynamic): Promise<dynamic>

        fun waitFor(num: Int): Promise<dynamic>

        fun content(): Promise<dynamic>

        fun click(selector: dynamic): Promise<dynamic>

        fun close(): Promise<dynamic>

        fun evaluate(pageFunction: Function<dynamic>): Promise<dynamic>

    }

    class Browser {

        fun newPage(): Promise<Page>

        fun close(): Promise<dynamic>

        fun wsEndpoint(): String

    }

    fun launch(options: dynamic): Promise<Browser>
}
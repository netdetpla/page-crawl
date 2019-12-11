import kotlin.coroutines.*
import kotlin.js.Promise

suspend fun <T> Promise<T>.await(): T = suspendCoroutine { cont ->
    then({ cont.resume(it) }, { cont.resumeWithException(it) })
}

fun <T> async(x: suspend () -> T): Promise<T> {
    return Promise { resolve, reject ->
        x.startCoroutine(object : Continuation<T> {
            override val context = EmptyCoroutineContext

            override fun resumeWith(result: Result<T>) {
                if (result.isSuccess)
                    resolve(result.getOrNull()!!)
                else
                    reject(result.exceptionOrNull()!!)
            }
        })
    }
}

fun spider(url: String): String {
    var content = ""
    async {
        val browser = Puppeteer.launch(object {}.also { it: dynamic ->
            it.devtools = true
            it.args = arrayOf("--no-sandbox", "--disable-setuid-sandbox")
            it.headless = true
        }).await()
        try {
            val page = browser.newPage().await()
            page.goto(url, object {}.also { it: dynamic -> it.timeout = 10 * 1000 }).await()
            page.waitFor(1000).await()
            content = page.content().await() as String
        } finally {
            browser.close().await()
        }
    }
    return content
}

fun main() {
    async {
        val browser = Puppeteer.launch(object {}.also { it: dynamic ->
            it.devtools = true
            it.args = arrayOf("--no-sandbox", "--disable-setuid-sandbox")
            it.headless = true
        }).await()
        try {
            val page = browser.newPage().await()
            page.goto("http://www.baidu.com", object {}.also { it: dynamic -> it.timeout = 10 * 1000 }).await()
            page.waitFor(1000).await()
            val content = page.content().await()
            println(content.toString())
        } finally {
            browser.close().await()
        }
    }
}
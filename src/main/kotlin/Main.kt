import beans.URL
import interfaces.FS
import interfaces.Puppeteer
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

object Main {

    private const val appStatusDir = "/tmp/appstatus/"
    private const val resultDir = "/tmp/result/"
    private var urls = ArrayList<URL>()

    init {
        if (!FS.existsSync(appStatusDir)) {
            FS.mkdirSync(appStatusDir, true)
        }
        if (!FS.existsSync(appStatusDir)) {
            FS.mkdirSync(resultDir, true)
        }
    }

    fun parseParam() {
        val param = FS.readFileSync("/tmp/conf/busi.conf", "utf8")
        for (p in param.split(";")) {
            val ps = p.split(",")
            urls.add(URL(ps[0], ps[1]))
        }
        Log.debug("params: ")
        Log.debug(param)
    }

    private fun spider(url: String): String {
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

    fun execute() {
        Log.info("spider start")
        for (url in urls) {
            url.html = js("Buffer").from(spider(url.url)).toString("base64") as String
        }
        Log.info("spider end")
    }

    fun writeResult() {
        Log.info("writing result file")
        for (url in urls) {
            val fileName = url.id + ".result"
            FS.writeFileSync(resultDir + fileName, "${url.id},${url.html}")
        }
    }

    fun successEnd() {
        FS.writeFileSync(appStatusDir + "0", "")
    }

    fun errorEnd(message: String, code: Int) {
        FS.writeFileSync(appStatusDir + "1", message)
        js("process").exit(code)
    }

}

fun main() {
    Log.info("page-crawl start")
    // 获取配置
    Main.parseParam()
    // 执行
    try {
        Main.execute()
        // 写结果
        Main.writeResult()
    } catch (e: Exception) {
        Log.error(e.toString())
        Main.errorEnd(e.toString(), 11)
    }
    // 结束
    Main.successEnd()
    Log.info("page-crawl end successfully")
}

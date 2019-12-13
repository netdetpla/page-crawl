package interfaces

@Suppress("FunctionName")
@JsModule("fs")
external object FS {

    fun readFileSync(path: String, encoding: String): String

    fun writeFileSync(path: String, data: String)

    fun mkdirSync(path: String, recursive: Boolean)

    fun existsSync(path: String): Boolean

}
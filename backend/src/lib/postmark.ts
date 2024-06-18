import { ServerClient } from 'postmark'
import config from "../config"

var client = new ServerClient(config.email.postmark.key)

export default client
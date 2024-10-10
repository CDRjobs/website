import UAParser from 'ua-parser-js'

var parser = new UAParser()

const isIOS = () => {
  return parser.getResult().os.name === 'iOS'
}

export default isIOS
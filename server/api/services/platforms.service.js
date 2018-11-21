import fs from 'fs'
import Path from 'path'
import axios from 'axios'
import _ from 'lodash'
import l from '../../common/logger'

axios.defaults.baseURL = process.env.IGDB_BASE_URL

const axiosOptions = {
  headers: {
    accept: 'application/json',
    'user-key': process.env.IGDB_USER_KEY
  }
}

class PlatformsService {
  all() {
    return axios.get('platforms/?order=slug&limit=40&offset=110', axiosOptions)
      .then(response => {
        l.info(response.data)
        return response
      })
      .then(response => [].concat(_.map(response.data)))
      .catch(err => `Error: ${err}`)
  }

  byId(id) {
    l.info(`${this.constructor.name}.byId(${id})`);
    return axios.get(`platforms/${id}`, axiosOptions)
      .then(response => response.data)
      .then(data => _.first(data))
      .then(datum => this.generateEvents(datum))
      .catch(err => `Issue: ${err}`)
  }

  generateEvents(datum) {
    const url = datum.logo.url;
    const hiresUrl = url.replace(/t_thumb/, 't_720p')
    this.downloadImage(hiresUrl)
    return _.toPlainObject(datum)
  }

  async downloadImage(url) {
    const path = Path.resolve(__dirname, '../../../img', 'platform.jpg')
    const response = await axios({
      method: 'GET',
      url: `https:${url}`,
      responseType: 'stream'
    })

    // pipe the result stream into a file on disc
    response.data.pipe(fs.createWriteStream(path))

    // return a promise and resolve when download finishes
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve()
      })

      response.data.on('error', () => {
        reject()
      })
    })
  }
}

export default new PlatformsService();

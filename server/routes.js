import examplesRouter from './api/controllers/examples/router'
import gamesRouter from './api/controllers/games/router'
import platformsRouter from './api/controllers/platforms/router'

export default function routes(app) {
  app.use('/api/v1/examples', examplesRouter)
  app.use('/api/v1/games', gamesRouter)
  app.use('/api/v1/platforms', platformsRouter)
}

import { redisClient } from '../../DB/connection.js';

export const caching = (key)=>{
  return async(req, res, next) => {
    const cacheResult = await redisClient.get(`${key}`)
    if (!cacheResult) {
      return next()
    }
    const result = JSON.parse(cacheResult)
    return res.status(200).json({message: "Done", isCached: true, result })
  }
}

export default caching
const express = require("express");
const scrape1337x = require("../../controllers/1337x");
const router = express.Router();

// swagger

/**
 * @swagger
 * /torrent/1337x/search/{query}/{pageNo}:
 *  get:
 *    tags: 
 *      - 1337x 
 *    summary: API to fetch list of torrent links from 1337x 
 *    description: Retirve list of torrent links from 1337x based on given query
 *    parameters:
 *    - in: path
 *      name: query
 *      schema:
 *        type: string
 *      description: query to search
 *      default : matrix 1999 
 *    - in: path
 *      name: pageNo
 *      schema:
 *        type: number
 *        minimum: 1
 *        maximum: 10
 *      description: page number of search
 *      default : 1
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *       description: No Data Avaialble or IP Blocked
 */

/* GET home page. */
router.get("/search/:query/:pageNo", function (req, res, next) {
 try{
  const query = req.params.query;
  const page = req.params.pageNo;

  if (page > 10) {
    res.status(406).json({
      code: 406,
      errorMessage: "Page number must be less then 10",
      stauts: "Request Failed at router",
    });
  } else {
    scrape1337x(query, page).then((data) => {
      if (data === null) {
        res.status(404).json({
          code: 404,
          errorMessage: "IP Blocked by 1337x || 1337x is blocked by govt",
          stauts: "Request Failed at controller",
        });
      } else if (data.length === 0) {
        res.status(404).json({
          code: 404,
          errorMessage: "No Results found for : " + query,
          stauts: "Request Failed at controller",
        });
      } else {
        res.send(data);
      }
    });
  }
 }catch(error){
  res.status(501).json({
          code: 404,
          errorMessage: "Internal Server Error",
          stauts: "Request Failed",
  })
 }
});

module.exports = router;

const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

//handles the swaps data. GET POST PUT
// gathers ALL SWAPS
// sends to front end
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM "swaps" ORDER BY "id";`;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.get("/ownedswaps", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT * FROM "swaps" 
    WHERE "owner" = $1
    ORDER BY "id";`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      res.send(result.rows);
      // console.log(result);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

//insert into SWAPS database
router.post("/", rejectUnauthenticated, (req, res) => {
  const swap = req.body;
  console.log("sending swap", swap);
  const queryText = `INSERT INTO "swaps" ("is_private", "start_date", "sell_date", 
  "stop_date", "access_code")
    VALUES($1, $2, $3, $4, $5)`;
  pool
    .query(queryText, [
      swap.is_private,
      swap.start_date,
      swap.sell_date,
      swap.stop_date,
      swap.access_code,
    ])
    .then((response) => {
      console.log(response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error in swaps POST", error);
      res.sendStatus(500);
    });
});

//push existing items into swap

router.post("/addToSwap", rejectUnauthenticated, (req, res) => {
  const swapItem = req.body;
  console.log("adding item to swap", swapItem);
  const queryText = `INSERT INTO "swap_item_join" ("item_id", "swap_id")
  VALUES($1, $2)`;
  pool
    .query(queryText, [swapItem.item_id, swapItem.swap_id])
    .then((response) => {
      console.log(response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

//join swap item join
// using a get to grab all data from multiple tables
router.get("/swapItems/:id", rejectUnauthenticated, (req, res) => {

  const swapID = req.params.id;
  console.log('swapID', swapID);

  const queryText = `
  SELECT items.*, ARRAY_AGG(url) image, "categories"."name" AS "category_name",
  "favorites"."id" AS "favorites_id", "favorites"."item_id", "favorites"."user_id", 
  "user"."username", "user"."email", "user"."user_image", "swaps"."id" AS "swap_id", "swaps"."access_code", "swaps"."is_private", "swaps"."sell_date",
  "swaps"."start_date", "swaps"."stop_date", "swaps"."swap_open" FROM "items"

  LEFT JOIN "categories" ON "items".cat_id = "categories".id
  LEFT JOIN "images" ON "items".id = "images".item_id
  LEFT JOIN "swap_item_join" ON "swap_item_join".item_id = "items".id 
  LEFT JOIN "favorites" ON "favorites".item_id = "items".id
  LEFT JOIN "user" ON "items".user_id = "user".id
  LEFT JOIN "swaps" ON "swaps".id = "swap_item_join".swap_id
  WHERE "swaps".id = $1
  GROUP BY "swaps"."id", "items".id, "categories".name, "user"."username", "user"."email", "user"."user_image", "favorites"."id";`;
  pool
    .query(queryText, [swapID])
    .then((result) => {

      res.send(result.rows);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// JOINS get to grab only the swaps the user has joined
router.get("/swapsJoined", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT * FROM "swaps" JOIN "swap_users" 
    ON "swap_users".swap_id = "swaps".id
    JOIN "user" ON "user".id = "swap_users".user_id;
    `;
  pool
    .query(queryText)
    .then((result) => {
      console.log(result);

      res.send(result.rows);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// PUT route to edit existing swaps
router.put("/:id", rejectUnauthenticated, (req, res) => {
  const swapToEdit = req.params.id;
  const queryText = `UPDATE "swaps" where "id" = $1, "is_private" = $2,
  "start_date" = $3, sell_date = $4, "stop_date" = $5, "swap_open" = $6, "access_code" = $7;`;
  pool
    .query(queryText, [
      req.body.id,
      req.body.is_private,
      req.body.start_date,
      req.body.stop_date,
      req.body.swap_open,
      req.body.access_code,
      swapToEdit,
    ])
    .then((response) => {
      response.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error making Edit to database query ${queryText}`, error);
    });
});

module.exports = router;

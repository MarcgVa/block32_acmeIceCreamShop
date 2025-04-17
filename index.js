require("dotenv").config();
const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");
const PORT = process.env.SERVER_PORT || 3000;
const pool = require("./database");

//MIDDLEWARE
app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get('/api/flavors', async (req, res) => { 
  try {
    
    const sql = "SELECT * FROM flavors";
    const allFlavors = await pool.query(sql);
    res.status(200).json(allFlavors.rows);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

app.get('/api/flavors/:id', async (req, res) => { 
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM flavors WHERE id = $1'
    const flavor = await pool.query(sql, [id]);
    res.status(200).json(flavor.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

app.post('/api/flavors', async (req, res, next) => { 
  try {
    let response = "";
    const { name, is_favorite } = req.body;
    
    const sql = `INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *`;
    
    if (is_favorite) {
      response = await pool.query(sql, [name, is_favorite]);
      
    } else { 
      response = await pool.query(sql, [name, false]);
    }

    res.status(201).json(response.rows[0]);

  } catch (error) {
    console.error(error);
    next(error);
  }

});

app.delete('/api/flavors/:id', async (req, res, next) => { 
  try {
    const { id } = req.params;
    const sql = "DELETE FROM flavors WHERE id = $1"
    const response = await pool.query(sql, [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    let response = "";
    const { id } = req.params;
    const { name, is_favorite } = req.body;
    if (name && is_favorite) {
      const sql = "UPDATE flavors SET name = $1, is_favorite = $2 WHERE id = $3";
      response = await pool.query(sql, [name, is_favorite, id]);
    }
    if (name && !is_favorite) { 
      const sql =
        "UPDATE flavors SET name = $1 WHERE id = $2";
      response = await pool.query(sql, [name, id]);
    }
    if (!name && is_favorite) {
      const sql = "UPDATE flavors SET is_favorite = $1 WHERE id = $2";
      response = await pool.query(sql, [is_favorite, id]);
    }
    res.send(200).send(response.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
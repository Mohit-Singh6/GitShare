const db = require('../db');

exports.getAllSnippets = async (req, res) => {
    try {
        const user = { user_id: req.user.user_id, username: req.user.username };
        const data = await db.query("SELECT * FROM snippets WHERE user_id = $1", [user.user_id]);

        res.status(200).json({
            message: "Snippets retrieved successfully!",
            snippets: data.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error during snippet retrieval");
    }
};


exports.createSnippet = async (req, res) => {
    try {
        // req.user was securely populated by your protect middleware!
        const user = await { user_id: req.user.user_id, username: req.user.username };
        console.log("Authenticated User in createSnippet:", user);
        const { title, code_content, tags } = req.body; // tags is an array: ['react', 'node']

        // 1. Insert the snippet and capture the new snippet row
        console.log("User.user_id: ", user.user_id);
        const newSnippet = await db.query(
            "INSERT INTO snippets (user_id, title, code_content) VALUES ($1, $2, $3) RETURNING *", 
            [user.user_id, title, code_content]
        );
        const snippetId = newSnippet.rows[0].id;

        // 2. Loop through each tag sent from the frontend
        for (const tag of tags) {
            
            // 3. Upsert the tag name. If it exists, it safely returns the existing row's ID
            const tagResult = await db.query(
                `INSERT INTO tags (tag_name) 
                 VALUES ($1) 
                 ON CONFLICT (tag_name) 
                 DO UPDATE SET tag_name = EXCLUDED.tag_name 
                 RETURNING id`, 
                [tag]
            );
            const tagId = tagResult.rows[0].id;

            // 4. Create the relational link in your junction table
            await db.query(
                "INSERT INTO snippet_tags (snippet_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", 
                [snippetId, tagId]
            );
        }

        // 5. Send back a successful response containing the created snippet data
        res.status(201).json({
            message: "Snippet and tags created successfully!",
            snippet: newSnippet.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Something went wrong while creating the snippet.");
    }
}

exports.getSnippetByTag = async (req, res) => {
    try {
        const userId = req.user.user_id;
        console.log("req.params: ", req.params);
        const { tag } = req.params; // Expects a URL parameter like /api/snippets/tag/react
        console.log("tag: ", tag);

        const query = `
            SELECT s.* FROM snippets s
            JOIN snippet_tags st ON s.id = st.snippet_id
            JOIN tags t ON st.tag_id = t.id
            WHERE t.tag_name = $1 AND s.user_id = $2;
        `;

        const result = await db.query(query, [tag, userId]);

        res.status(200).json({
            message: `Snippets tagged with #${tag} fetched successfully!`,
            count: result.rowCount,
            snippets: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Something went wrong while fetching snippets by tag.");
    }
};


exports.getSnippetById = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id } = req.params; // Expects a URL parameter like /api/snippets/101

        const query = `
            SELECT s.*, 
                   COALESCE(JSON_AGG(t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL), '[]') AS tags
            FROM snippets s
            LEFT JOIN snippet_tags st ON s.id = st.snippet_id
            LEFT JOIN tags t ON st.tag_id = t.id
            WHERE s.id = $1 AND s.user_id = $2
            GROUP BY s.id;
        `;

    //     Choice A: The Junior Developer Way (2 Separate Database Calls)
        //     Query the snippet: SELECT * FROM snippets WHERE id = $1;
        //     Wait for Postgres to reply.
        //     Take that snippet ID, and run a second query to get its tags: SELECT t.tag_name FROM tags t JOIN snippet_tags st ON t.id = st.tag_id WHERE st.snippet_id = $1;
        //     Wait for Postgres to reply again.
        //     Combine them manually in JavaScript.
        
        // Choice B: The Professional Way (1 Master Query)
            //  Instead of two separate trips, we use the long query you posted to let PostgreSQL do all the heavy lifting in one single, optimized operation.
            //     The LEFT JOIN columns: This tells Postgres to temporarily stitch your snippets, snippet_tags, and tags tables together sideways based on their matching IDs.
            //     The JSON_AGG(t.tag_name) columns: Without this, if a snippet had 3 tags, the join would force Postgres to return 3 separate duplicate rows of the exact same snippet just to show the different tag names. JSON_AGG tells Postgres: "Take all those separate tag string rows, squash them together into a single JSON array, and attach that array to the snippet object as a column named tags."


        const result = await db.query(query, [id, userId]);

        // If rowCount is 0, it means the snippet either doesn't exist OR belongs to another user
        if (result.rows.length === 0) {
            return res.status(404).send("Snippet not found or unauthorized access.");
        }

        res.status(200).json({
            snippet: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Something went wrong while fetching the snippet details.");
    }
};
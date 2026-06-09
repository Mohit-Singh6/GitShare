const db = require('../db');

exports.getAllTags = async (req, res) => {
    try {
        const user = { user_id: req.user.user_id, username: req.user.username };
        const data = await db.query("SELECT DISTINCT t.tag_name FROM snippets s JOIN snippet_tags st ON s.id = st.snippet_id JOIN tags t ON st.tag_id = t.id WHERE s.user_id = $1 ORDER BY t.tag_name ASC;", [user.user_id]);

        res.status(200).json({
            message: "Tags retrieved successfully!",
            tags: data.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error during tag retrieval");
    }
};

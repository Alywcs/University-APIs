const connectToDatabase = require("../db");

// Get all universities
exports.getAllUniversities = async function (req, res) {
  let query = "SELECT * FROM universities";

  const { name, country, page = 1, limit = 3 } = req.query;
  const filters = [];
  if (name) {
    filters.push(`Name LIKE '%${name}%'`);
  }
  if (country) {
    filters.push(`Country = '${country}'`);
  }
  // Only add the WHERE clause if filters exist
  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }
  // Ensure bookmarked universities appear first
  query += " ORDER BY isBookmark DESC ";
  // Implement limit and pagination
  query += `LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query);
    connection.release();

    res.json({
      success: true,
      data: result[0],
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error("Error fetching universities:", err);
    res.json({
      success: false,
      message: "Failed to fetch universities.",
    });
  }
};

// Get university by ID
exports.getUniversityById = async function (req, res) {
  const id = req.params.id;
  const query = "SELECT * FROM universities WHERE Id = ?";

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, [id]);
    connection.release();

    if (result[0].length > 0) {
      res.json({
        success: true,
        data: result[0][0],
      });
    } else {
      res.json({
        success: false,
        message: "University not found.",
      });
    }
  } catch (err) {
    console.error("Error fetching university by ID:", err);
    res.json({
      success: false,
      message: "Failed to fetch university.",
    });
  }
};

// Create a new university
exports.createUniversity = async function (req, res) {
  const { name, country, webpages } = req.body;
  const query = "SELECT * FROM universities WHERE name = ?";

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, [name]);

    if (result[0].length > 0) {
      connection.release();
      res.json({
        success: false,
        message: "University already exists.",
      });
    } else {
      const currentDateTime = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Format: "YYYY-MM-DD HH:MM:SS"

      await connection.execute(
        "INSERT INTO universities (Name, Country, Webpages, Created, LastModified) VALUES (?, ?, ?, ?, ?)",
        [name, country, webpages, currentDateTime, currentDateTime]
      );
      connection.release();

      res.json({
        success: true,
        message: "University added successfully.",
      });
    }
  } catch (err) {
    console.error("Error creating university:", err);
    res.json({
      success: false,
      message: "Failed to create university.",
    });
  }
};

// Update a university
exports.updateUniversity = async function (req, res) {
  const id = req.params.id;
  const { name, country, webpages } = req.body; // Variables should never be undefined or empty, based on frontend design, can set restrictions on frontend

  const query = "SELECT * FROM universities WHERE Id = ?";

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, [id]);

    if (result[0].length === 0) {
      connection.release();
      res.json({
        success: false,
        message: "University not found.",
      });
    } else {
      // Check for exisiting university name (prevent duplicate, Name column should be already set to unique but just in case, give error)
      const existingUniversityName = await connection.query(
        "SELECT * FROM universities WHERE name = ?",
        [name]
      );
      console.log("original name: ", result[0][0]);

      if (existingUniversityName[0].length > 0 && result[0][0].Name != name) {
        // Different name than original and exists already
        connection.release();
        res.json({
          success: false,
          existingEmail: true,
          message:
            "University name already exists. Please choose a different name.",
        });
      } else {
        const currentDateTime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Format: "YYYY-MM-DD HH:MM:SS"

        await connection.execute(
          "UPDATE universities SET Name = ?, Country = ?, Webpages = ?, LastModified = ? WHERE Id = ?",
          [name, country, webpages, currentDateTime, id]
        );
        connection.release();

        res.json({
          success: true,
          message: "University updated successfully.",
        });
      }
    }
  } catch (err) {
    console.error("Error updating university:", err);
    res.json({
      success: false,
      message: "Failed to update university.",
    });
  }
};

// Delete a university
exports.deleteUniversity = async function (req, res) {
  const id = req.params.id;
  const query = "SELECT * FROM universities WHERE Id = ?";

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, [id]);

    if (result[0].length === 0) {
      connection.release();
      res.json({
        success: false,
        message: "University not found.",
      });
    } else {
      const currentDateTime = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Format: "YYYY-MM-DD HH:MM:SS"

      const updateActiveField = 0;
      await connection.execute(
        "UPDATE universities SET isActive = ?, LastModified = ?, DeletedAt = ? WHERE Id = ?",
        [updateActiveField, currentDateTime, currentDateTime, id]
      );
      connection.release();

      res.json({
        success: true,
        message: "University deleted successfully.",
      });
    }
  } catch (err) {
    console.error("Error deleting university:", err);
    res.json({
      success: false,
      message: "Failed to deleting university.",
    });
  }
};

exports.bookmarkUniversity = async function (req, res) {
  const id = req.params.id;
  const query = "SELECT * FROM universities WHERE Id = ?";

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, [id]);

    if (result[0].length === 0) {
      connection.release();
      res.json({
        success: false,
        message: "University not found.",
      });
    } else {
      const currentDateTime = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Format: "YYYY-MM-DD HH:MM:SS"

      const isBookmarked = result[0][0].IsBookmark;
      const updateBookmarkField = isBookmarked == 1 ? 0 : 1;
      await connection.execute(
        "UPDATE universities SET isBookmark = ?, LastModified = ? WHERE Id = ?",
        [updateBookmarkField, currentDateTime, id]
      );
      connection.release();

      if (updateBookmarkField == 1) {
        res.json({
          success: true,
          message: "University bookmarked successfully.",
        });
      } else {
        res.json({
          success: true,
          message: "University removed from bookmark successfully.",
        });
      }
    }
  } catch (err) {
    console.error("Error bookmarking university:", err);
    res.json({
      success: false,
      message: "Failed to bookmark university.",
    });
  }
};

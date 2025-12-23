const UpdateConfig = require('../models/UpdateConfig');

/**
 * Check for updates
 * Compares the client's version (optional) with the latest version on the server.
 */
exports.checkForUpdate = async (req, res) => {
    // Optional: Get current version from query parameter
    const currentVersion = req.query.currentVersion;

    try {
        // Fetch the most recent update config
        const latestConfig = await UpdateConfig.findOne().sort({ createdAt: -1 });

        if (!latestConfig) {
             return res.status(404).json({ message: "No update configuration found." });
        }

        // Log the check request 
        if (currentVersion) {
            console.log(`Update check received from version: ${currentVersion}`);
        } else {
            console.log('Update check received (no version provided)');
        }

        // Return the latest version info from DB
        res.status(200).json({
            latestVersion: latestConfig.latestVersion,
            downloadUrl: latestConfig.downloadUrl,
            forceUpdate: latestConfig.forceUpdate,
            releaseNotes: latestConfig.releaseNotes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

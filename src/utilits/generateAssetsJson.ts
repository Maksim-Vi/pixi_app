// import * as fs from "fs";
// import * as path from "path";

const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.resolve("public/assets");
const OUTPUT_FILE = path.join(ASSETS_DIR, "assets.json");

interface AssetInfo {
    assetName: string;
    assetPath: string;
    fullAssetPath: string;
    ext: string;
}

const assets: AssetInfo[] = [];

function walkDir(dir: string, baseDir: string) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            walkDir(fullPath, baseDir);
        } else {
            const ext = path.extname(file.name).slice(1);
            const assetName = path.basename(file.name, path.extname(file.name));
            const relativePath = path.relative(baseDir, dir).replace(/\\/g, "/");

            assets.push({
                assetName,
                assetPath: relativePath ? relativePath + "/" : "",
                fullAssetPath: dir.replace(/\\/g, "/") + "/",
                ext,
            });
        }
    }
}

function generateAssetsJson() {
    if (!fs.existsSync(ASSETS_DIR)) {
        console.error(`Folder ${ASSETS_DIR} not found`);
        process.exit(1);
    }

    walkDir(ASSETS_DIR, ASSETS_DIR);

    const output = {
        // basePath: "public/assets/",
        basePath: "assets/",
        assets,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");
    console.log(`assets.json created: ${OUTPUT_FILE}`);
    console.log(`found files: ${assets.length}`);
}

generateAssetsJson();

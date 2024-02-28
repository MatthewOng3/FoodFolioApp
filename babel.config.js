module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            "module:metro-react-native-babel-preset",
            "babel-preset-expo"
        ],
        plugins: [
            [
                "module:react-native-dotenv",
                {
                    moduleName: "@env",
                    path: ".env",
                    blacklist: null,
                    whitelist: null,
                    safe: false,
                    allowUndefined: true
                }
            ],
            [
                "module-resolver",
                {
                    extensions: [
                        ".js",
                        ".jsx",
                        ".ts",
                        ".tsx",
                        ".android.js",
                        ".android.tsx",
                        ".ios.js",
                        ".ios.tsx"
                    ],
                    root: ["./src"],
                    alias: {
                        "@components": "./src/components",
                        "@contexts": "./src/contexts",
                        "@database": "./src/database",
                        "@hooks": "./src/hooks",
                        "@redux_store": "./src/redux_store",
                        "@screens": "./src/screens",
                        "@util": "./src/util"
                    }
                }
            ],
            ["babel-plugin-styled-components"],
            "react-native-reanimated/plugin"
        ]
    };
};

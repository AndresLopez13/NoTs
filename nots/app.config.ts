import { ExpoConfig, ConfigContext } from "expo/config";
import * as dotenv from "dotenv";

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "nots-expo",
    name: "NoTs",
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: "febbe6ea-76f2-4b47-8b71-6295e30d9516",
      },
    },
    android: {
      package: "com.nots",
    },
    
  };
};

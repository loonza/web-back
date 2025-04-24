import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

interface SuperTokensConfig {
  connectionURI: string;
  apiKey?: string;
  appInfo: {
    appName: string;
    apiDomain: string;
    websiteDomain: string;
  };
}

@Module({})
export class AuthModule {
  static forRoot(config: SuperTokensConfig): DynamicModule {
    supertokens.init({
      framework: 'express',
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      appInfo: {
        ...config.appInfo,
        apiBasePath: '/user/login',
        websiteBasePath: '/',
      },
      recipeList: [EmailPassword.init(), Session.init()],
    });

    return {
      module: AuthModule,
      imports: [ConfigModule],
      providers: [AuthService],
      exports: [AuthService],
    };
  }
}

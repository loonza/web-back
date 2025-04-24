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
        connectionURI:
          'https://st-dev-20e31280-2020-11f0-9a56-ef0e94efae55.aws.supertokens.io',
        apiKey: 'G4Ebm20VyxsAfHTLe4vQy9ZKV4',
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

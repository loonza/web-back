import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private config: ConfigService) {}

  onModuleInit(): void {
    supertokens.init({
      framework: 'express',
      supertokens: {
        connectionURI: this.config.get<string>('SUPERTOKENS_CONNECTION_URI')!,
        apiKey: this.config.get<string>('SUPERTOKENS_API_KEY')!,
      },
      appInfo: {
        appName: 'MyApp',
        apiDomain: 'https://m3312-vafaullin.onrender.com',
        websiteDomain: 'https://m3312-vafaullin.onrender.com',
        apiBasePath: '/user/login',
        websiteBasePath: '/',
      },
      recipeList: [EmailPassword.init(), Session.init()],
    });
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';

@Module({
	imports: [
		// Add Redis Cache Configuration
		// CacheModule.register({
		// 	isGlobal: true,
		// 	store: redisStore,
		// 	host: 'localhost',
		// 	port: 6379,
		// 	ttl: 3600, // Default TTL: 1 hour
		// }),
		ConfigModule.forRoot(),
		// GraphQL Backend Server Qurish
		GraphQLModule.forRoot({
			driver: ApolloDriver,
			playground: true,
			uploads: false,
			autoSchemaFile: true,
			formatError: (error: T) => {
				const graphQlFormattedError = {
					code: error?.extensions.code,
					message: error?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
				};
				console.dir(error, { depth: null });
				console.log('GRAPHQL GLOBAL ERR:', graphQlFormattedError);
				return graphQlFormattedError;
			},
		}),
		ComponentsModule,
		DatabaseModule,
		SocketModule, // ==> ichida - API serverga bogliq bulgan mantiqlarni
	],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}

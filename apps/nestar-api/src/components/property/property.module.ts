import { Module } from '@nestjs/common';
import { PropertyResolver } from './property.resolver';
import { PropertyService } from './property.service';
import PropertySchema from '../../schemas/Property.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        {
            name: "Property",
            schema: PropertySchema,
        },
    ]),
    AuthModule, // AuthModule da UseGuards larni chaqirib olamiz
    ViewModule // viewmodule ga tegishli viewServiceni bemalol ishlatamiz
  ],

  providers: [PropertyResolver, PropertyService]
})
export class PropertyModule {}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { Properties, Property } from '../../libs/dto/property/property';
import { AgentPropertiesInquiry, AllPropertiesInquiry, PropertiesInquiry, PropertyInput } from '../../libs/dto/property/property.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { PropertyUpdate } from '../../libs/dto/property/property.update';

@Resolver()
export class PropertyResolver {
    constructor(private readonly propertyService: PropertyService) {}


    @Roles(MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Mutation(() => Property)
    public async createProperty(
        @Args('input') input:PropertyInput,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Property> {
        console.log("Mutation: createProperty");
        input.memberId = memberId;
        return this.propertyService.createProperty(input);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Property)
    public async getProperty(
        @Args("propertyId") input: string, // qaysi property id ni olmoqchimiz
        @AuthMember("_id") memberId: ObjectId,
    ): Promise<Property> {
        console.log("Query; getProperty")
        const propertyId = shapeIntoMongoObjectId(input)
        return await this.propertyService.getProperty(memberId, propertyId);
    };

    @Roles(MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Property)
    public async updateProperty(
        @Args('input') input: PropertyUpdate,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Property> {
        console.log("Mutation: updateProperty");
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.propertyService.updateProperty(memberId, input);
    };

    @UseGuards(WithoutGuard)
    @Query((returns) => Property)
    public async getProperties(
        @Args("input") input: PropertiesInquiry, // qaysi property id ni olmoqchimiz
        @AuthMember("_id") memberId: ObjectId,
    ): Promise<Properties> {
        console.log("Query; getProperty")
        return await this.propertyService.getProperties(memberId, input);
    };

    @Roles(MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Query((returns) => Properties)
    public async getAgentProperties(
        @Args("input") input: AgentPropertiesInquiry, // qaysi property id ni olmoqchimiz
        @AuthMember("_id") memberId: ObjectId,
    ): Promise<Properties> {
        console.log("Query; getProperty")
        return await this.propertyService.getAgentProperties(memberId, input);
    };
///////////////////////////
    /** ADMIN **/
///////////////////////////


    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query((returns) => Properties)
    public async getAllPropertiesByAdmin(
        @Args('input') input: AllPropertiesInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Properties> {
        console.log('Query: getAllPropertiesByAdmin');
        return await this.propertyService.getAllPropertiesByAdmin(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Property)
    public async updatePropertyByAdmin(@Args('input') input: PropertyUpdate): Promise<Property>{
        console.log("Mutation: updatePropertyByAdmin");
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.propertyService.updatePropertyByAdmin(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Property)
    public async removePropertyByAdmin(@Args('propertyId') input: string): Promise<Property> {
        console.log('Mutation: removePropertyByAdmin');
        const propertyId = shapeIntoMongoObjectId(input);
        return await this.propertyService.removePropertyByAdmin(propertyId);
    }

}

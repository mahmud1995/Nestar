import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";

// backend dan => frontendga yuboriladigan data transferring object hosil qilamiz
@ObjectType() // backend serverdan clientga yuborilayotgan typelar(dto)ni qurish uchun decorator
export class Member {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => MemberType) // graphql ning registerEnumType orqali enum urniga ishlatish mumkin
    memberType: MemberType

    @Field(() => MemberStatus) // graphql ning registerEnumType orqali enum urniga ishlatish mumkin
    memberStatus: MemberStatus

    @Field(() => MemberAuthType)
    memberAuthType: MemberAuthType;

    @Field(() => String)
    memberPhone: string;
    
    @Field(() => String)
    memberNick: string;

    memberPassword?: string

    @Field(() => String, {nullable: true})
    memberFullName?:string;

    @Field(() => String) //A GraphQL scalar type is a primitive (like ID, String, Boolean, or Int)
    memberImage: string;

    @Field(() => String, {nullable: true})
    memberAddress?: string;

    @Field(() => String, {nullable: true})
    memberDesc?: string;

    @Field(() => Int)
    memberProperties: number;

    @Field(() => Int)
    memberArticles: number;

    @Field(() => Int)
    memberFollowers: number;

    @Field(() => Int)
    memberFollowings: number;
    
    @Field(() => Int)
    memberPoints: number;

    @Field(() => Int)
    memberLikes: number;

    @Field(() => Int)
    memberViews: number;

    @Field(() => Int)
    memberComments: number;
    
    @Field(() => Int)
    memberWarnings: number;

    @Field(() => Int)
    memberBlocks: number;

    @Field(() => Int)
    memberRank: number;

    @Field(() => Date, {nullable: true})
    deletedAt?: Date; 

    @Field(() => Date)
    createdAt?: Date; 
    
    @Field(() => Date)
    updatedAt?: Date; 

    @Field(() => String, { nullable:true})
    accessToken?: string;
}

@ObjectType()
export class TotalCounter {
    @Field(() => Int, {nullable: true})
    total: number
}

@ObjectType()
export class Members {
    @Field(() => [Member])
    list: Member[];

    @Field(() => [TotalCounter], {nullable: true})
    metaCounter: TotalCounter[];
}
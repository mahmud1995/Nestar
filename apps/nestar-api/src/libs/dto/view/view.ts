import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
import { ViewGroup } from "../../enums/view.enum";

@ObjectType() 
export class View {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => ViewGroup)
    viewGroup: ViewGroup;

    @Field(() => String)
    viewRefId: ObjectId;

    @Field(() => ViewGroup)
    memberId: ObjectId;

    @Field(() => Date)
    createdAt?: Date; 
    
    @Field(() => Date)
    updatedAt?: Date; 
}


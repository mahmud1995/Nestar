import { Mutation, Resolver, Query, Args, ArgsType } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UseGuards } from '@nestjs/common';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from "../auth/guards/auth.guard";
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';


@Resolver()
/*
    - MemberServiceni chaqirishdan maqsad: MemberResolverning ixtiyoriy query ida ishlatishimiz mumkin
    - Query[GET] & mutation[REST API] mantiqlarini hosil qilamiz
    - @Mutation(() => Member): Mutation bizga Member[dto[member.ts]] ni qaytaradi
*/
export class MemberResolver {
    constructor( private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
        console.log("Mutation: signup");
        return await this.memberService.signup(input);
    } 

    // Authenticated: (USER, AGENT, ADMIN)
    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput): Promise<Member> {
        console.log("Mutation: login");
        return await this.memberService.login(input);
    } 


























    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args("input") input: MemberUpdate,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Member> {
        console.log('Mutation: updateMember');
        delete input._id;
        return this.memberService.updateMember(memberId, input);
    }




    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getMember(
        @Args("memberId") input: string, 
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Member> {
        console.log("Query: getMember");
        console.log("memberId:", memberId)
        const targetId = shapeIntoMongoObjectId(input);
        return await this.memberService.getMember(memberId, targetId);
    }


    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember('memberNick') memberNick: Member): Promise<string> {
        console.log('Mutation: checkAuth');
        console.log('memberNick:', memberNick);
        
        return `Hi ${memberNick}`;
    }

    @Roles(MemberType.USER, MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
        console.log('Query: checkAuthRoles');
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
    }
    

    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getAgents(
        @Args('input') input: AgentsInquiry, 
        @AuthMember('_id') memberId: ObjectId): Promise<Members> {
        console.log('Query: getAgents');
        return await this.memberService.getAgents(memberId, input);
    }

    /** ADMIN */
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => Members)
    public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
        console.log('Query: getAllMembersByAdmin');
        return await this.memberService.getAllMembersByAdmin(input);
    }
    
    // Authorization: ADMIN
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Member)
    public async updateMembersByAdmin(@Args("input") input: MemberUpdate): Promise<Member> {
        console.log('Mutation: updateMembersByAdmin');
        return await this.memberService.updateMembersByAdmin(input);
    }

}



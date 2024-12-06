import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UseGuards } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from "../auth/guards/auth.guard";
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';


@Resolver()
/*
    - MemberServiceni chaqirishdan maqsad: MemberResolverning ixtiyoriy query ida ishlatishimiz mumkin
    - Query[GET] & mutation[REST API] mantiqlarini hosil qilamiz
    - @Mutation(() => Member): Mutation bizga Member[dto[member.ts]] ni qaytaradi
*/
export class MemberResolver {
    constructor( private readonly memberService: MemberService) {}
    
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Signup
    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput): Promise<Member> {
        console.log("Mutation: signup");
        return this.memberService.signup(input);
    } 
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // Authenticated: (USER, AGENT, ADMIN)
    @UseGuards(AuthGuard)

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Login
    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput): Promise<Member> {
        console.log("Mutation: login");
        return this.memberService.login(input);
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>UpdateMember
    public async updateMember(@AuthMember('_id') memberId: ObjectId): Promise<string> {
        console.log('Mutation: updateMember');
        return this.memberService.updateMember();
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>GetMember
    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Query: getMember");
        return this.memberService.getMember();
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember('memberNick') memberNick: Member): Promise<string> {
        console.log('Mutation: checkAuth');
        console.log('memberNcik:', memberNick);
        
        return `Hi ${memberNick}`;
    }

    @Roles(MemberType.USER, MemberType.AGENT)
    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
        console.log('Query: checkAuthRoles');
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
    }
    /** ADMIN */
    // Authorization: ADMIN
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => String)
    public async getAllMembersByAdmin(): Promise<string> {
        console.log('Mutation: getAllMembersByAdmin');
        return this.memberService.getAllMembersByAdmin();
    }
    // Authorization: ADMIN
    @Mutation(() => String)
    public async updateMembersByAdmin(): Promise<string> {
        console.log('Mutation: updateMembersByAdmin');
        return this.memberService.updateMembersByAdmin();
    }

}

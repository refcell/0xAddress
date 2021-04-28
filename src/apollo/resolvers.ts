import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import {
    createUser,
    findUser,
    validatePassword,
    setLoginSession,
    getLoginSession,
    removeTokenCookie,
    fetchImages,
    uploadImage
} from '../lib';
import validator from 'validator'

export const resolvers = {
    Query: {
        async viewer(_parent: any, _args: any, context: any, _info: any) {
            try {
                const session = await getLoginSession(context.req);

                if (session) {
                    return findUser({ email: session.email });
                }
            } catch (error) {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in',
                );
            }
        },
        async images(_parent: any, _args: any, context: any, _info: any) {
            try {
                const session = await getLoginSession(context.req);
                if (session) {
                    return fetchImages({ email: session.email });
                }
            } catch (error) {
                throw new AuthenticationError(
                    'Authentication token is invalid, please log in',
                );
            }
        },
    },
    Mutation: {
        async signUp(_parent: any, args: any, _context: any, _info: any) {
            // * Validate Strong Password
            if (validator.isStrongPassword(args.input.password, {
                minLength: 8, minLowercase: 1,
                minUppercase: 1, minNumbers: 1, minSymbols: 1
            })) {
                const user = await createUser(args.input);
                return { user };
            }

            throw new UserInputError('Password requirements not met!');
        },
        async signIn(_parent: any, args: any, context: any, _info: any) {
            const user = await findUser({ email: args.input.email });
            // console.info(user, await validatePassword(user, args.input.password));
            if (user && (await validatePassword(user, args.input.password))) {
                const session = {
                    id: user.id,
                    email: user.email,
                };

                await setLoginSession(context.res, session);

                return { user };
            }

            throw new UserInputError('Invalid email and password combination');
        },
        async signOut(_parent: any, _args: any, context: any, _info: any) {
            removeTokenCookie(context.res);
            return true;
        },
        async uploadImage(_parent: any, args: any, _context: any, _info: any) {
            const image = await uploadImage(args.input);
            return { image };
        },
    },
};
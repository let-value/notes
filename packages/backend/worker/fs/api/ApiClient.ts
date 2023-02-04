import { ReactiveState } from "app/src/utils";
import { DispatcherService, Query } from "messaging";
import { User } from "oidc-client-ts";

export class ApiClient<TError> {
    user = new ReactiveState<User | null>(null);
    constructor(private dispatcher: DispatcherService, private oidc: Query<User, User>) {}
    async getUser() {
        let user = this.user.getValue();

        if (!user) {
            const response = await this.dispatcher.call(this.oidc, undefined);
            user = new User(response);
            this.user.next(user);
        }

        if (user.expired) {
            const response = await this.dispatcher.call(this.oidc, user);
            user = new User(response);
            this.user.next(user);
        }

        return user;
    }

    setUser(user: User) {
        this.user.next(new User(user));
    }

    async call<TResponse>(input: RequestInfo | URL, init?: RequestInit) {
        const { token_type, access_token } = await this.getUser();

        const response = await fetch(input, {
            ...init,
            headers: {
                ...init?.headers,
                Authorization: `${token_type} ${access_token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw result as TError;
        }

        return result as TResponse;
    }

    async download(input: RequestInfo | URL, init?: RequestInit) {
        const { token_type, access_token } = await this.getUser();

        const response = await fetch(input, {
            ...init,
            headers: {
                ...init?.headers,
                Authorization: `${token_type} ${access_token}`,
            },
        });

        if (!response.ok) {
            throw (await response.json()) as TError;
        }

        return await response.text();
    }
}

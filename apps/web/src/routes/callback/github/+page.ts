import { env } from '$env/dynamic/public';

export async function load({ url: { searchParams } }) {
    const code = searchParams.get('code');
    if (!code) {
        return {
            status: 302,
            headers: {
                location: '/'
            }
        };
    } else {
        try {
            const response = await fetch(`${env.PUBLIC_API_URL}/auth/github?code=${code}`, {
                method: 'POST'
            })
            const { jwt } = await response.json();
            return {
                status: 302,
                headers: {
                    location: '/',
                    'set-cookie': `jwt=${jwt}; Path=/; HttpOnly`
                }
            };
        } catch (error) {
            console.log(error)
            return {
                status: 500,
                headers: {
                    location: '/'
                },
                body: {
                    error: error.message
                }
            };
        }
    }
}
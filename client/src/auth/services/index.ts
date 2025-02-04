class Auth{
    public async login({ email, password }:{ email: string, password: string }){
        // aa
        const delayPromise = new Promise<void>((resolve) => setTimeout(() =>{ 
            resolve() 
        }, 3000));
        
        await delayPromise;
        return {message: "Login successful"}
    }
}

export const authService = new Auth();
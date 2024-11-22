import React, {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react"

type UserContextType = {
    user: { [key: string]: any } | null
    setUser: Dispatch<SetStateAction<{ [key: string]: any } | null>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

function useUser(): UserContextType {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser not found')
    }
    return context
}


const UserProvider = (props: { children: ReactNode }): ReactElement => {
    const [user, setUser] = useState<{ [key: string]: any } | null>(null)

    return <UserContext.Provider {...props} value={{
        user,
        setUser
    }} />

}

export { UserProvider, useUser }
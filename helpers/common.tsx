import dayjs, { Dayjs } from 'dayjs'
import { Identifiable, IdentifiableArray } from 'src/@types/common'
import { ENV_TO_UPDATE, STORAGE_KEYS } from 'src/constants'
import { env } from 'src/env'

export const pluralize = (single: string, plural: string, amount: number) => amount > 1 ? plural : single

export const getDate = (date: Date | Dayjs | null, format: string) => dayjs(date).format(format)

export const addKeysFromIds = <T extends Identifiable>(
    items: IdentifiableArray<T> = []
): Array<T & { key: T['id'] }> => items.map((item) => ({ ...item, key: item.id }))

export const findSearchText = (name: string, currentValue: string,  className: string) => {
    const includeInName = name.toLowerCase().indexOf(currentValue.toLowerCase())

    if (includeInName !== -1) {
        const startIndexElement = includeInName
        const lastIndexElement = startIndexElement + currentValue.length
        return (
            <>
                {name.slice(0, startIndexElement)}
                <span className={className}>{name.slice(startIndexElement, lastIndexElement)}</span>
                {name.slice(lastIndexElement)}
            </>
        )
    } else {
        return name
    }
}

export const validateLocalStorage = () => {
    const versionFromLocalStorage = localStorage.getItem(STORAGE_KEYS.IBAPositionsVersion)
    const versionFromEnv =  env.REACT_APP_VERSION || ''
    const environment = env.REACT_APP_ENV || ''

    if (ENV_TO_UPDATE.includes(environment) && versionFromLocalStorage !== versionFromEnv) {
        Object.keys(STORAGE_KEYS).forEach((key: string) => localStorage.removeItem(key))

        localStorage.setItem(STORAGE_KEYS.IBAPositionsVersion, versionFromEnv)
    }
}

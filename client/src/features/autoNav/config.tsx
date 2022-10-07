const translation: Record<string, string> = {
    '': '首页',
    'apply': '入会申请',
};

export const menuItem = [
    '',
    'apply'
]

export function getTranslation(key: string) {
    const trans = translation[key]
    if (trans === undefined) {
        return key
    }
    return trans
}
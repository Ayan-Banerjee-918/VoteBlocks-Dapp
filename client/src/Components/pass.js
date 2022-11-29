let characters = '';
let passwordLength = 0;

const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const shuffle = wd =>{
    var t="";
    for(wd=wd.split("");wd.length>0;)
        t+=wd.splice(wd.length*Math.random()<<0,1);
    return t
}

const passwordCharacters = (account) => {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    characters += 'abcdefghijklmnopqrstuvwxyz';
    characters += '!@#$%^&*()<>,.?/[]{}-=_+|/';
    characters += '0123456789';
    const characterList = characters;
    let password = '';
    if (characterList.length > 0) {
        for (let i = 0; i < passwordLength; i++) {
            password += characterList[getRandomInteger(0, characterList.length - 1)];
        }
        characters = '';
        passwordLength = 0;
        password+=account;
        return shuffle(password);
    }
}

export const setPasswordLength = length => {
    passwordLength = length;
    return passwordLength;
}

export const generatePassword = (account,pwdLength) => {
    setPasswordLength(pwdLength);
    const password = passwordCharacters(account);
    return password;
}
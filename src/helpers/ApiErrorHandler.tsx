import { ERROR_CODES, PARAMETER_CODES } from "../constants/Enumerations";
import { useAuthentication } from "../contexts/authentication/AuthenticationContext";

export const useApiErrorHandler = () => {
    const { parameters } = useAuthentication();

    const handleApiError = (err: any): string => {
        if (!err?.response?.data) {
            return "Bilinmeyen bir hata oluştu, sistem yönetinizle iletişime geçiniz.";
        }

        const { errorCode, errorMessage } = err.response.data;

        switch (errorCode) {
            case ERROR_CODES.TOKEN_EXPIRED:
                return "Token'ın süresi dolmuş. Lütfen Çıkış/Giriş yapıp, tekrar deneyiniz.";
            case ERROR_CODES.RESET_PASSWORD_TOKEN_EXPIRED:
                return "Parola Sıfırla Token geçerlilik süresi dolmuştur. Yeni parola sıfırlama isteği mailinize tekrardan gönderilmiştir.";
            case ERROR_CODES.RESET_PASSWORD_TOKEN_NOT_FOUND:
                return "Parola Sıfırla Token ile kayıt bulunamadı.";
            case ERROR_CODES.TOKEN_VALIDATION_ERROR:
                return "Token doğrulanırken bir hata oluştu.";
            case ERROR_CODES.REQUIRED_FIELD: {
                const match = errorMessage?.match(/\[(.*?)\]/);
                const value = match ? match[1] : null;

                return value != null
                    ? "[%s] zorunlu alandır, lütfen kontrol ediniz.".replace("%s", value)
                    : "Zorunlu alanları kontrol ediniz.";
            }
            case ERROR_CODES.PASSIVE_USER:
                return "Kullanıcı henüz aktifleştirilmemiştir, gelen kutunuzu kontrol ediniz.";
            case ERROR_CODES.INCORRECT_USERNAME_OR_PASSWORD:
                return "Kullanıcı adı veya Parola Hatalı, girdiğiniz bilgileri kontrol ediniz.";
            case ERROR_CODES.INCORRECT_OLD_PASSWORD:
                return "Mevcut parolanız hatalı.";
            case ERROR_CODES.PASSWORD_DOES_NOT_CONFIRM:
                return "Parola doğrulanamadı.";
            case ERROR_CODES.PASSWORD_AT_LEAST_CHARACTERS_LONG: {
                const value = parameters?.find(item => item.code == PARAMETER_CODES.PASSWORD_AT_LEAST_CHARACTER_LONG)?.value ?? "8";
                return "Parola en az %s karakter olmalıdır.".replace("%s", value);
            }
            case ERROR_CODES.PASSWORD_AT_LEAST_ONE_UPPERCASE:
                return "Parola en az 1 büyük harf içermelidir.";
            case ERROR_CODES.PASSWORD_AT_LEAST_ONE_LOWERCASE:
                return "Parola en az 1 küçük harf içermelidir.";
            case ERROR_CODES.PASSWORD_AT_LEAST_ONE_DIGIT:
                return "Parola en az 1 rakam içermelidir.";
            case ERROR_CODES.PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER:
                return "Parola en az 1 özel karakter içermelidir";
            case ERROR_CODES.LAST_3_PREVIOUS_PASSWORD_DIFFERENT:
                return "Yeni girilen parola, son 3 paroladan farklı olmak zorundadır.";
            case ERROR_CODES.DO_NOT_HAVE_PERMISSION:
                return "Yapmaya çalıştığınız işlemi gerçekleştirme yetkiniz bulunmamaktadır";
            case ERROR_CODES.USERNAME_ALREADY_REGISTERED:
                return "Kullanıcı sistemde zaten kayıtlı.";
            case ERROR_CODES.USED_BY_THE_SYSTEM: {
                const match = errorMessage?.match(/\[(.*?)\]/);
                const value = match ? match[1] : null;
                return value != null
                    ? "[%s] zorunlu alandır, lütfen kontrol ediniz.".replace("%s", value)
                    : "Zorunlu alanları kontrol ediniz.";
            }
            case ERROR_CODES.RECORD_WITH_ID_NOT_FOUND: {
                const match = errorMessage?.match(/\[(.*?)\]/);
                const value = match ? match[1] : null;
                return value != null
                    ? "[%s] zorunlu alandır, lütfen kontrol ediniz.".replace("%s", value)
                    : "Zorunlu alanları kontrol ediniz.";
            }
            default:
                return errorMessage ?? "Bilinmeyen bir hata oluştu, sistem yönetinizle iletişime geçiniz.";
        }
    };

    return { handleApiError };
};

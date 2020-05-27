export interface IConfigService {
  /**
   * Инициализация настроек приложения. Должен вызываться в APP_INITIALIZER
   * Читает env/env.json и env/config.[env].json
   * @envPath: Путь к папке с настройками окружения
   */
  load(envPath?: string): Promise<boolean>;

  /**
   * Получить параметр из конфиг.файла
   * @key Ключ объекта в конфиг.файле
   * @defaultValue Значение по умолчанию, которое вернется если значение по ключу отсутствует
   * @subKey Дополнительный ключ для поиска в коллекции values обьекта с ключом key
   * @return Значение св-ва
   */
  getConfig<T>(key: string, defaultValue: T, subKey?: string): T;

  /**
   * Чтение свойства из env файла
   * @key Ключ объекта в env файле
   * @return Значение св-ва
   */
  getEnv(key: any);
}


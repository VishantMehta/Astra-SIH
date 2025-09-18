from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    #The format for the database URL is: #postgresql://<user>:<password>@<host>:<port>/<dbname>
    DATABASE_URL: str

settings = Settings()
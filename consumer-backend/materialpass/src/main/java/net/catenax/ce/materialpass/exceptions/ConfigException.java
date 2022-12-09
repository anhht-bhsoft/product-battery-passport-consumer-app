package net.catenax.ce.materialpass.exceptions;

public class ConfigException extends RuntimeException{
        public ConfigException(String configuration, String errorMessage) {
            super("["+configuration+"] " + errorMessage);
        }
        public ConfigException(String configuration, Exception e, String errorMessage) {
            super("["+configuration+"] " + errorMessage+", "+e.getMessage());
        }

}

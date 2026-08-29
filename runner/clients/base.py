from abc import ABC, abstractmethod


class BaseClient(ABC):

    @abstractmethod
    def generate(self, prompt: str):
        raise NotImplementedError

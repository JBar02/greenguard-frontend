# GreenGuard Frontend

Aplikacja frontendowa (interfejs użytkownika) dla projektu systemu monitorowania roślin GreenGuard.

## Opis Projektu

Ten moduł stanowi warstwę prezentacji systemu GreenGuard. Jego głównym celem jest zapewnienie intuicyjnego interfejsu użytkownika do interakcji z backendem GreenGuard. Aplikacja umożliwia:

* Przeglądanie listy istniejących sensorów zarejestrowanych w systemie.
* Dodawanie nowych sensorów poprzez formularz.
* Wyświetlanie dodatkowych informacji (np. aktualnych danych pogodowych pobieranych z zewnętrznego API).

Frontend komunikuje się z backendem poprzez REST API w celu zarządzania danymi sensorów.

## Backend

Aplikacja frontendowa współpracuje z backendem GreenGuard. Kod źródłowy backendu znajduje się w osobnym repozytorium:

[https://github.com/Ciamcioo/GreenGuard](https://github.com/Ciamcioo/GreenGuard)

**Ważne:** Przed uruchomieniem frontendu, upewnij się, że backend GreenGuard jest uruchomiony i dostępny (domyślnie oczekiwany na porcie `9090`). Instrukcje dotyczące uruchomienia backendu znajdziesz w pliku `README.md` w repozytorium backendu.

## Jak uruchomić lokalnie

Aby uruchomić aplikację frontendową GreenGuard na swoim komputerze w środowisku dewelopmentu, wykonaj poniższe kroki:

**Wymagania wstępne:**

* Zainstalowany Node.js i menedżer pakietów npm (który jest instalowany razem z Node.js) lub Yarn.

**Kroki uruchomienia:**

1.  **Sklonuj lub pobierz kod frontendu:**
    Jeżeli jeszcze tego nie zrobiłeś, upewnij się, że masz kod projektu frontendowego na swoim komputerze.

2.  **Przejdź do katalogu projektu w terminalu:**
    Otwórz terminal lub wiersz poleceń i przejdź do głównego katalogu projektu frontendowego GreenGuard (tam, gdzie znajduje się plik `package.json`).
    ```bash
    cd /ścieżka/do/katalogu/GreenGuard-frontend
    ```
    (Zastąp `/ścieżka/do/katalogu/GreenGuard-frontend` rzeczywistą ścieżką do Twojego katalogu projektu frontendowego).

3.  **Zainstaluj zależności:**
    Zainstaluj wszystkie biblioteki i zależności wymagane przez projekt, korzystając z npm lub Yarn:
    ```bash
    npm install
    # lub jeśli używasz Yarn:
    # yarn install
    ```

4.  **Skonfiguruj Proxy (dla dewelopmentu):**
    Upewnij się, że w pliku `package.json` w głównym katalogu projektu frontendowego masz dodaną konfigurację proxy, która przekierowuje wywołania API do Twojego lokalnego backendu. Jest to kluczowe dla poprawnej komunikacji podczas dewelopmentu i ominięcia problemów z CORS. Sprawdź, czy w pliku `package.json` znajduje się linia:
    ```json
      "proxy": "http://localhost:9090",
    ```
    (Upewnij się, że jest umieszczona w głównym obiekcie JSON, np. po linii `"private": true,`).

5.  **Uruchom Backend:**
    Upewnij się, że Twój backend GreenGuard jest uruchomiony. Frontend potrzebuje działającego backendu, aby pobierać i wysyłać dane dotyczące sensorów. Postępuj zgodnie z instrukcjami uruchomienia podanymi w `README.md` repozytorium backendu ([link do README backendu](#backend)).

6.  **Uruchom Frontend:**
    W terminalu, będąc nadal w głównym katalogu projektu frontendowego, uruchom serwer dewelopmentowy Reacta:
    ```bash
    npm start
    # lub jeśli używasz Yarn:
    # yarn start
    ```

7.  **Otwórz aplikację w przeglądarce:**
    Serwer dewelopmentowy zostanie uruchomiony (domyślnie na porcie `3000`), a aplikacja powinna automatycznie otworzyć się w Twojej domyślnej przeglądarce pod adresem:
    [http://localhost:3000](http://localhost:3000)

Teraz aplikacja frontendowa GreenGuard powinna być w pełni funkcjonalna i komunikować się z uruchomionym backendem.



Ten moduł stanowi warstwę prezentacji systemu GreenGuard. Jego głównym celem jest zapewnienie intuicyjnego interfejsu użytkownika do interakcji z backendem GreenGuard. Aplikacja umożliwia:

* Przeglądanie listy istniejących sensorów zarejestrowanych w systemie.
* Dodawanie nowych sensorów poprzez formularz.
* Wyświetlanie dodatkowych informacji (np. aktualnych danych pogodowych pobieranych z zewnętrznego API).
* Logowanie
* Tworzenie nowych kont

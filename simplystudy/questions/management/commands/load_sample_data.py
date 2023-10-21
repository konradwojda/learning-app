from django.core.management.base import BaseCommand, CommandError

from simplystudy.questions.models import Course, Question, QuestionSet, Test, TestQuestion
from simplystudy.users.models import User

SAMPLE_USERS = [
    User(username="first_user", password="password", email="1st@1st.pl"),
    User(username="second_user", password="password", email="2nd@2nd.pl"),
]

SAMPLE_COURSES = [
    Course(
        name="Algorithms 1",
        description="Course about algorithms.",
        university="KNU",
        owner=SAMPLE_USERS[0],
    ),
    Course(
        name="Wireless Networks",
        description="Course about wireless networks and how they work.",
        university="KNU",
        owner=SAMPLE_USERS[0],
    ),
    Course(
        name="Podstawy informatyki i programowania",
        description="Podstawowe informacje. Programowanie w języku Python.",
        university="PW",
        owner=SAMPLE_USERS[1],
    ),
    Course(
        name="Architektura komputerów",
        description="Podstawowe informacje nt budowy procesorów. Programowanie w języku Assembler.",
        university="PW",
        owner=SAMPLE_USERS[1],
    ),
]

SAMPLE_QUESTION_SETS = [
    QuestionSet(
        name="Algorithms Complexity",
        description="Complexities of different algorithms",
        course=SAMPLE_COURSES[0],
        owner=SAMPLE_USERS[0],
    ),
    QuestionSet(
        name="Binary seach trees",
        description="Questions about BST",
        course=SAMPLE_COURSES[0],
        owner=SAMPLE_USERS[0],
    ),
    QuestionSet(
        name="Cellural network evolution",
        description="History of cellural network",
        course=SAMPLE_COURSES[1],
        owner=SAMPLE_USERS[0],
    ),
    QuestionSet(
        name="Other wireless technologies",
        description="WiFi, Bluetooth, ZigBee",
        course=SAMPLE_COURSES[1],
        owner=SAMPLE_USERS[0],
    ),
    QuestionSet(
        name="Podstawy systemu Linux",
        description="Nauka korzystania z systemu linux",
        course=SAMPLE_COURSES[2],
        owner=SAMPLE_USERS[1],
    ),
    QuestionSet(
        name="Podstawy języka Python",
        description="Nauka programowania w Pythonie",
        course=SAMPLE_COURSES[2],
        owner=SAMPLE_USERS[1],
    ),
    QuestionSet(
        name="Podstawy architektury x86",
        description="Architektura x86 oraz x86_64",
        course=SAMPLE_COURSES[3],
        owner=SAMPLE_USERS[1],
    ),
    QuestionSet(
        name="Podstawy budowy procesorów",
        description="Nauka o budowie procesora",
        course=SAMPLE_COURSES[3],
        owner=SAMPLE_USERS[1],
    ),
]

SAMPLE_QUESTIONS = [
    Question(
        content="What are the main types of computational complexity used in algorithm analysis?",
        answer="The main types of computational complexity are time complexity, space complexity, and average-case complexity. Time complexity measures how long an algorithm takes to perform its operations based on the size of the input data. Space complexity determines how much memory is needed to execute the algorithm. Average-case complexity considers the average performance of the algorithm over various input scenarios.",
        question_set=SAMPLE_QUESTION_SETS[0],
    ),
    Question(
        content="Why is time complexity important in algorithm analysis?",
        answer="Time complexity is important because it helps us determine how efficiently an algorithm operates based on the size of the input data. It assists in selecting efficient algorithms for solving specific problems and predicting how algorithms will perform in practice.",
        question_set=SAMPLE_QUESTION_SETS[0],
    ),
    Question(
        content="What are the differences between worst-case, average-case, and expected-case computational complexities?",
        answer="Worst-case computational complexity measures the maximum time or resources required by an algorithm in the worst scenario. Average-case complexity considers the average behavior of the algorithm. Expected-case complexity calculates the average computational complexity considering the probability of different cases. They differ in their approaches to analyzing algorithm behavior based on input data.",
        question_set=SAMPLE_QUESTION_SETS[0],
    ),
    Question(
        content="What operations can be performed on a binary search tree?",
        answer="Operations on a binary search tree include inserting new nodes, deleting existing nodes, traversing the tree in inorder, preorder, and postorder, and searching for specific elements within the tree.",
        question_set=SAMPLE_QUESTION_SETS[1],
    ),
    Question(
        content="What are the fundamental rules for inserting and deleting nodes in a binary search tree?",
        answer="Basic rules for inserting nodes in a binary search tree include adding a new node as a leaf and maintaining the proper order of nodes. Deleting nodes involves finding the node to remove while preserving the correct order of nodes and replacing it with another node (e.g., successor or predecessor) or directly deleting it if it has no children.",
        question_set=SAMPLE_QUESTION_SETS[1],
    ),
    Question(
        content="How is a binary search tree utilized for data storage?",
        answer="Binary search trees are used for data storage in a way that allows efficient searching, insertion, and deletion of elements. They find applications in various fields of computer science, such as databases, file systems, sorting algorithms, and many tasks requiring efficient data access.",
        question_set=SAMPLE_QUESTION_SETS[1],
    ),
    Question(
        content="What were the key stages in the evolution of cellular networks?",
        answer="Key stages in the evolution of cellular networks include the first generation (1G) based on analog voice transmission, the second generation (2G) introducing digital voice transmission and SMS, the third generation (3G) offering data transmission and internet access, the fourth generation (4G) providing high-speed data transmission, and the fifth generation (5G) bringing ultra-fast connectivity, low latency, and support for IoT devices.",
        question_set=SAMPLE_QUESTION_SETS[2],
    ),
    Question(
        content="What technologies were used in the early generations of cellular networks?",
        answer="The first generation (1G) relied on analog voice transmission. The second generation (2G) introduced digital voice transmission and allowed for SMS messaging. The third generation (3G) brought data transmission and internet access. The fourth generation (4G) delivered high-speed data transmission.",
        question_set=SAMPLE_QUESTION_SETS[2],
    ),
    Question(
        content="What benefits did the introduction of 5G networks bring compared to previous generations?",
        answer="The deployment of 5G networks brought several advantages over previous generations, such as significantly higher data transmission speeds, lower latency, support for a massive number of concurrent devices, and the ability to handle applications requiring high bandwidth, like virtual reality, augmented reality, and autonomous vehicles.",
        question_set=SAMPLE_QUESTION_SETS[2],
    ),
    Question(
        content="What are the differences between WiFi, Bluetooth, and ZigBee technologies?",
        answer="WiFi technology is used for wireless communication in local area networks and offers higher range and bandwidth compared to Bluetooth and ZigBee. Bluetooth is commonly used for short-range connections between devices, such as headphones and keyboards. ZigBee is a low-power technology suitable for IoT networks, enabling communication between many low-energy devices.",
        question_set=SAMPLE_QUESTION_SETS[3],
    ),
    Question(
        content="What are the primary applications of Bluetooth technology in today's world?",
        answer="Bluetooth technology is widely used in today's world for establishing wireless connections between devices like headphones, speakers, keyboards, mice, smartphones, tablets, and many others. It is also used in cars for connecting to mobile phones and other devices.",
        question_set=SAMPLE_QUESTION_SETS[3],
    ),
    Question(
        content="How can ZigBee technology be utilized in IoT networks?",
        answer="ZigBee technology is often employed in Internet of Things (IoT) networks due to its low power consumption and the ability to support a large number of devices. It can be used to create wireless sensor networks, environmental monitoring, smart home systems, health monitoring applications, and various other IoT use cases.",
        question_set=SAMPLE_QUESTION_SETS[3],
    ),
    Question(
        content="Jakie są główne komponenty systemu Linux i jakie są ich zadania?",
        answer="Główne komponenty systemu Linux to jądro (kernel), które zarządza zasobami sprzętowymi, i przestrzenie użytkownika, które zawierają aplikacje i narzędzia. Jądro odpowiada za zarządzanie procesami, pamięcią, urządzeniami wejścia/wyjścia i innymi zasobami. Przestrzenie użytkownika to miejsce, w którym użytkownicy uruchamiają swoje programy i korzystają z systemu.",
        question_set=SAMPLE_QUESTION_SETS[4],
    ),
    Question(
        content="Jakie są podstawowe polecenia terminala w systemie Linux?",
        answer="System Linux oferuje wiele podstawowych poleceń terminala, takich jak ls (listowanie plików i katalogów), cd (zmiana katalogu), mkdir (tworzenie katalogu), rm (usuwanie pliku lub katalogu), cp (kopiowanie plików), mv (przenoszenie plików), touch (tworzenie pustego pliku), cat (wyświetlanie zawartości plików) i wiele innych.",
        question_set=SAMPLE_QUESTION_SETS[4],
    ),
    Question(
        content="Jakie są główne dystrybucje systemu Linux i jakie są ich różnice?",
        answer="Istnieje wiele dystrybucji systemu Linux, takich jak Ubuntu, Debian, CentOS, Fedora, Arch Linux itp. Różnice między nimi obejmują zarządzanie pakietami, menedżery pakietów, konfigurację systemu, terminale, środowiska graficzne i wiele innych. Wybór dystrybucji zależy od potrzeb i preferencji użytkownika.",
        question_set=SAMPLE_QUESTION_SETS[4],
    ),
    Question(
        content="Jakie są podstawowe typy danych w języku Python?",
        answer="Podstawowe typy danych w języku Python to int (liczby całkowite), float (liczby zmiennoprzecinkowe), str (łańcuchy znaków), bool (typ logiczny), list (lista), tuple (krotka), dict (słownik) i wiele innych. Python jest językiem dynamicznie typowanym, co oznacza, że nie trzeba deklarować typów zmiennych.",
        question_set=SAMPLE_QUESTION_SETS[5],
    ),
    Question(
        content="Jakie są różnice między funkcjami a metodami w Pythonie?",
        answer="Funkcje w Pythonie są blokami kodu, które można wywoływać i wykonywać niezależnie od obiektu. Metody są funkcjami przypisanymi do obiektu i działają na nim. Metody są wywoływane za pomocą notacji kropkowej na obiekcie, a funkcje wywołuje się bezpośrednio.",
        question_set=SAMPLE_QUESTION_SETS[5],
    ),
    Question(
        content="Jakie są zalety stosowania Pythona jako języka programowania?",
        answer="Python jest popularny ze względu na swoją czytelność i prostotę składni, co ułatwia naukę i rozwijanie aplikacji. Ma duże wsparcie społeczności oraz bogatą bibliotekę standardową. Jest wieloplatformowy i można go używać do wielu zastosowań, takich jak web development, data science, sztuczna inteligencja i inne.",
        question_set=SAMPLE_QUESTION_SETS[5],
    ),
    Question(
        content="Jakie są główne cechy architektury x86?",
        answer="Główne cechy architektury x86 to architektura procesora oparta na zestawie instrukcji x86, która jest szeroko używana w komputerach osobistych i serwerach. Posiada zestaw ogólnego przeznaczenia rejestrów, obsługę przerwań i wyjątków, oraz tryby pracy, takie jak tryb rzeczywisty i tryb chroniony. Architektura x86 obsługuje zarówno 32-bitowe, jak i 64-bitowe systemy.",
        question_set=SAMPLE_QUESTION_SETS[6],
    ),
    Question(
        content="Jakie są różnice między trybem rzeczywistym a trybem chronionym w architekturze x86?",
        answer="Tryb rzeczywisty (real mode) w architekturze x86 to tryb pracy, który jest ograniczony do obsługi 16-bitowych aplikacji i jest bardziej podatny na błędy. Tryb chroniony (protected mode) to bardziej zaawansowany tryb, który obsługuje 32-bitowe aplikacje, zapewnia ochronę pamięci i bezpieczeństwo systemu oraz obsługuje wiele bardziej zaawansowanych funkcji.",
        question_set=SAMPLE_QUESTION_SETS[6],
    ),
    Question(
        content="Jakie są główne rejestry ogólnego przeznaczenia w architekturze x86?",
        answer="W architekturze x86 istnieje kilka głównych rejestrów ogólnego przeznaczenia, takich jak EAX, EBX, ECX, EDX, ESI, EDI, ESP i EBP. Są one używane do przechowywania danych i adresów w pamięci. Rejestry te mają różne zadania i mogą być wykorzystywane do operacji arytmetycznych, logicznych i manipulacji danymi.",
        question_set=SAMPLE_QUESTION_SETS[6],
    ),
    Question(
        content="Jakie są główne komponenty budowy procesora?",
        answer="Główne komponenty budowy procesora to jednostka centralna (CPU), jednostka arytmetyczno-logiczna (ALU), rejestr ogólnego przeznaczenia (General Purpose Register - GPR), jednostka zarządzania pamięcią (Memory Management Unit - MMU), jednostka kontrolera przerwań i wiele innych. CPU wykonuje instrukcje, ALU zajmuje się operacjami arytmetycznymi i logicznymi, a rejestr GPR przechowuje dane. MMU zarządza pamięcią, a jednostka kontrolera przerwań obsługuje przerwania i wyjątki.",
        question_set=SAMPLE_QUESTION_SETS[7],
    ),
    Question(
        content="Jakie są główne różnice między architekturą RISC a CISC?",
        answer="Architektura RISC (Reduced Instruction Set Computer) ma prosty zestaw instrukcji, co oznacza, że każda instrukcja jest wykonywana w jednym cyklu zegara. Architektura CISC (Complex Instruction Set Computer) ma bardziej złożony zestaw instrukcji, który obejmuje bardziej złożone operacje, ale każda instrukcja może zajmować więcej niż jeden cykl zegara. RISC ma tendencję do wydajniejszego wykonywania prostych instrukcji, podczas gdy CISC może obsługiwać bardziej złożone operacje w jednej instrukcji.",
        question_set=SAMPLE_QUESTION_SETS[7],
    ),
    Question(
        content="Jakie są główne czynniki wpływające na wydajność procesora?",
        answer="Wydajność procesora zależy od wielu czynników, takich jak częstotliwość zegara, liczba rdzeni, rozmiar pamięci podręcznej, architektura mikroprocesora, wydajność pamięci RAM, szybkość przesyłania danych między pamięcią a procesorem, oraz optymalizacja kodu programu. Wpływ na wydajność mają również technologie takie jak pipelining, superskalarność i wykonywanie wielowątkowe.",
        question_set=SAMPLE_QUESTION_SETS[7],
    ),
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        for user in SAMPLE_USERS:
            user.save()
        for course in SAMPLE_COURSES:
            course.save()
        for question_set in SAMPLE_QUESTION_SETS:
            question_set.save()
        for question in SAMPLE_QUESTIONS:
            question.save()
        print("Loaded sample data.")

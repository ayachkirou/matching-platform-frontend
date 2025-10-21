--
-- PostgreSQL database dump
--

\restrict SZ92e83f5dXWvK28vu0BVPhJLWPCFPB23r8NSznCZMiZDM4kEt9e3MtwMinWHIw

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: candidatures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidatures (
    id bigint NOT NULL,
    student_id bigint NOT NULL,
    offre_id bigint NOT NULL,
    date_candidature timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(255) DEFAULT 'en_attente'::character varying,
    cv character varying(255),
    lettre_motivation character varying(255),
    nom character varying(255),
    prenom character varying(255),
    email character varying(255),
    telephone character varying(255),
    adresse character varying(255),
    niveau_etudes character varying(255),
    experience character varying(255),
    competences character varying(255),
    date_debut character varying(255),
    pretention_salariale character varying(255),
    CONSTRAINT candidatures_statut_check CHECK (((statut)::text = ANY (ARRAY[('en_attente'::character varying)::text, ('acceptee'::character varying)::text, ('refusee'::character varying)::text])))
);


ALTER TABLE public.candidatures OWNER TO postgres;

--
-- Name: candidatures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidatures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidatures_id_seq OWNER TO postgres;

--
-- Name: candidatures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidatures_id_seq OWNED BY public.candidatures.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    user_id bigint NOT NULL,
    nom_entreprise character varying(255) NOT NULL,
    telephone character varying(255),
    adresse character varying(255),
    site_web character varying(255),
    registre_commerce character varying(100),
    ice character varying(100),
    document_justificatif character varying(255),
    secteur_activite character varying(255),
    description character varying(255),
    logo character varying(255),
    status_verification character varying(255) DEFAULT 'pending'::character varying,
    CONSTRAINT companies_status_verification_check CHECK (((status_verification)::text = ANY (ARRAY[('pending'::character varying)::text, ('verified'::character varying)::text, ('rejected'::character varying)::text])))
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: offres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offres (
    id bigint NOT NULL,
    company_id bigint NOT NULL,
    titre character varying(255) NOT NULL,
    description text NOT NULL,
    competences_requises text,
    type_offre character varying(255) NOT NULL,
    localisation character varying(255),
    salaire character varying(255),
    date_publication timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT offres_type_offre_check CHECK (((type_offre)::text = ANY (ARRAY[('stage'::character varying)::text, ('emploi'::character varying)::text])))
);


ALTER TABLE public.offres OWNER TO postgres;

--
-- Name: offres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offres_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offres_id_seq OWNER TO postgres;

--
-- Name: offres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offres_id_seq OWNED BY public.offres.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    user_id bigint NOT NULL,
    adresse character varying(255),
    annee_obtention integer NOT NULL,
    competences character varying(255),
    cv character varying(255),
    diplome character varying(255),
    etablissement character varying(255),
    experiences character varying(255),
    nom character varying(255),
    photo_profil character varying(255),
    prenom character varying(255),
    specialite character varying(255),
    statut character varying(255),
    telephone character varying(255),
    CONSTRAINT students_statut_check CHECK (((statut)::text = ANY ((ARRAY['RECHERCHE_STAGE'::character varying, 'RECHERCHE_EMPLOI'::character varying, 'AUTRE'::character varying])::text[])))
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test (
    id bigint NOT NULL
);


ALTER TABLE public.test OWNER TO postgres;

--
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.test ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    actif boolean,
    date_creation_compte timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['STUDENT'::character varying, 'COMPANY'::character varying, 'ADMIN'::character varying, 'SUPER_ADMIN'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: candidatures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures ALTER COLUMN id SET DEFAULT nextval('public.candidatures_id_seq'::regclass);


--
-- Name: offres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offres ALTER COLUMN id SET DEFAULT nextval('public.offres_id_seq'::regclass);


--
-- Data for Name: candidatures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidatures (id, student_id, offre_id, date_candidature, statut, cv, lettre_motivation, nom, prenom, email, telephone, adresse, niveau_etudes, experience, competences, date_debut, pretention_salariale) FROM stdin;
1	18	11	2024-09-10 09:30:00	en_attente	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	18	12	2024-09-05 14:20:00	acceptee	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	19	13	2024-09-12 11:15:00	en_attente	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	19	14	2024-09-08 16:40:00	refusee	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	18	15	2024-09-15 10:00:00	en_attente	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	19	16	2024-09-14 15:30:00	en_attente	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (user_id, nom_entreprise, telephone, adresse, site_web, registre_commerce, ice, document_justificatif, secteur_activite, description, logo, status_verification) FROM stdin;
20	TechCorp Maroc	+212522345678	Casablanca, Sidi Maarouf	www.techcorp.ma	\N	\N	\N	Technologie	Entreprise spécialisée dans le développement logiciel	https://via.placeholder.com/50x50/4b6cb7/ffffff?text=Tech	verified
21	WebSoft Solutions	+212537654321	Rabat, Agdal	www.websoft.ma	\N	\N	\N	IT Services	Développement d applications web et mobiles	https://via.placeholder.com/50x50/182848/ffffff?text=Web	verified
22	DataScience Academy	+212520987654	Casablanca, Maarif	www.datascience.ma	\N	\N	\N	Formation & Consulting	Centre de formation en data science et IA	https://via.placeholder.com/50x50/27ae60/ffffff?text=Data	verified
\.


--
-- Data for Name: offres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offres (id, company_id, titre, description, competences_requises, type_offre, localisation, salaire, date_publication, date_modification) FROM stdin;
11	20	Développeur Fullstack Junior	Nous recherchons un développeur fullstack passionné pour rejoindre notre équipe. Environnement agile, technologies modernes.	["JavaScript", "React", "Node.js", "MongoDB"]	emploi	Casablanca	12000-15000 MAD	2025-09-17 19:40:55.770693	2025-09-17 19:40:55.770693
12	20	Stage Développement Frontend	Stage de 4-6 mois pour étudiants en informatique. Formation sur React et bonnes pratiques de développement.	["HTML", "CSS", "JavaScript", "React"]	stage	Casablanca	3000-4000 MAD	2025-09-17 19:40:55.770693	2025-09-17 19:40:55.770693
13	21	Ingénieur DevOps	Poste pour expert DevOps pour gérer notre infrastructure cloud et pipelines CI/CD.	["AWS", "Docker", "Kubernetes", "Jenkins"]	emploi	Rabat	18000-22000 MAD	2025-09-17 19:40:55.770693	2025-09-17 19:40:55.770693
14	21	Stage Backend Python	Stage en développement backend avec Python/Django. Idéal pour étudiants en génie logiciel.	["Python", "Django", "PostgreSQL", "API REST"]	stage	Rabat	3500-4500 MAD	2025-09-17 19:40:55.770693	2025-09-17 19:40:55.770693
15	22	Data Scientist	Recherche data scientist pour projets IA et machine learning. Environnement de recherche stimulant.	["Python", "Machine Learning", "TensorFlow", "SQL"]	emploi	Casablanca	16000-20000 MAD	2025-09-17 19:40:55.770693	2025-09-17 19:40:55.770693
16	22	Stage Data Analysis	Stage en analyse de données et visualisation. Utilisation de Power BI et Python.	["Python", "Pandas", "Power BI", "Excel"]	stage	Casablanca	4000-5000 MAD	2025-09-17 19:40:55.770693	2025-09-17 19:40:55.770693
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (user_id, adresse, annee_obtention, competences, cv, diplome, etablissement, experiences, nom, photo_profil, prenom, specialite, statut, telephone) FROM stdin;
18	Casablanca	2024	["Java", "Python", "React", "Spring Boot"]	\N	Licence en Informatique	Université Hassan II	Stage chez XYZ Technologies	Alaoui	\N	Mehdi	Développement Web	RECHERCHE_STAGE	+212612345678
19	Rabat	2023	["Python", "R", "SQL", "TensorFlow"]	\N	Master en Data Science	ENSIAS	Projet de recherche en IA	Benjelloun	\N	Fatima	Machine Learning	RECHERCHE_EMPLOI	+212698765432
\.


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test (id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, actif, date_creation_compte, email, mot_de_passe, role) FROM stdin;
18	t	2024-01-15 10:30:00	mehdi.alaoui@email.com	$2a$10$ABC123	STUDENT
19	t	2024-02-20 14:15:00	fatima.benjelloun@email.com	$2a$10$ABC123	STUDENT
20	t	2024-01-10 09:00:00	techcorp@email.com	$2a$10$ABC123	COMPANY
21	t	2024-02-05 11:30:00	websoft@email.com	$2a$10$ABC123	COMPANY
22	t	2024-03-12 16:45:00	datascience@email.com	$2a$10$ABC123	COMPANY
23	t	2024-01-01 08:00:00	admin@match.com	$2a$10$ABC123	ADMIN
\.


--
-- Name: candidatures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidatures_id_seq', 9, true);


--
-- Name: offres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offres_id_seq', 16, true);


--
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: candidatures candidatures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT candidatures_pkey PRIMARY KEY (id);


--
-- Name: candidatures candidatures_student_id_offre_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT candidatures_student_id_offre_id_key UNIQUE (student_id, offre_id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (user_id);


--
-- Name: offres offres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offres
    ADD CONSTRAINT offres_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (user_id);


--
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: candidatures candidatures_offre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT candidatures_offre_id_fkey FOREIGN KEY (offre_id) REFERENCES public.offres(id) ON DELETE CASCADE;


--
-- Name: candidatures candidatures_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT candidatures_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(user_id) ON DELETE CASCADE;


--
-- Name: companies companies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: students fkdt1cjx5ve5bdabmuuf3ibrwaq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT fkdt1cjx5ve5bdabmuuf3ibrwaq FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: offres offres_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offres
    ADD CONSTRAINT offres_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict SZ92e83f5dXWvK28vu0BVPhJLWPCFPB23r8NSznCZMiZDM4kEt9e3MtwMinWHIw


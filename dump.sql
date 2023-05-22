--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    userid integer NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    userid integer NOT NULL,
    shorturl character varying(8) NOT NULL,
    url text NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    visitcount integer DEFAULT 0 NOT NULL
);


--
-- Name: urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    confirmpassword text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES (11, 'cecabf72-9de3-40eb-938f-1c7253e58656', 21, '2023-05-21 20:46:02.589542');


--
-- Data for Name: urls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.urls VALUES (1, 21, 'YMYnvJKm', 'https://www.starplus.com/series/the-simpsons/3ZoBZ52QHb4x.', '2023-05-21 21:12:50.455247', 0);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (15, 'kaiena', 'kaiena@gmail.com', '$2b$10$1HygG6ylzs.LiOU7.eYjIe1QQvsJCpH2iqtjGut0B0N.j8xdCCxOC', '2023-05-21 16:03:53.403984', '123456');
INSERT INTO public.users VALUES (17, 'Daisy', 'daisy@gmail.com', '$2b$10$dtbphAlACdBQ0OA.sckpuOY/VzhYOyNIjI5c6vWYLoij6MPHdLJoG', '2023-05-21 16:05:07.195907', '123456');
INSERT INTO public.users VALUES (19, 'Marley', 'marley@gmail.com', '$2b$10$RZcSfdTjVTaZyPqYhrA8TO/2wlL19yoi/nZ3Hmf275ICXdJQWSTjm', '2023-05-21 16:10:37.814907', '123456');
INSERT INTO public.users VALUES (20, 'Jasmine', 'jasmine@gmail.com', '$2b$10$IOPyVSWK09CXUQ1G7zVlzu.YPpLAt3hQSzGJvGr6zru9hsK6ohro.', '2023-05-21 16:34:12.737685', '123456');
INSERT INTO public.users VALUES (21, 'Ana', 'ana@gmail.com', '$2b$10$WcNuD7ephm48eHy/qpULb.Ic7ecREXrZeikLnwaaUMVYptCmPUhcK', '2023-05-21 16:45:34.840684', '123456');
INSERT INTO public.users VALUES (22, 'Lana', 'lana@gmail.com', '$2b$10$HSOhm1n0QYd/clUWljwR6e32F2bj/njviRHKDD4jNhjedc5XCBlUy', '2023-05-21 16:53:03.531494', '123456');
INSERT INTO public.users VALUES (23, 'Taylor', 'taylor@gmail.com', '$2b$10$eK8AoAK3mDh4jDSz1Xh3MOsryqm.NwMGBetdyJOjm2AX.I7G9dXR6', '2023-05-21 19:05:34.624505', NULL);
INSERT INTO public.users VALUES (26, 'João', 'joao@gmail.com', '$2b$10$omBuGlebGJfkFtzfO7HFGegvtJEtvtB8VGqNYo9xJ0JALS3GMlwMW', '2023-05-21 19:20:29.48074', NULL);
INSERT INTO public.users VALUES (27, 'Maria', 'maria@gmail.com', '$2b$10$XglvQD6fOZEW8vJzvQgkAuSj8ZSgcKBoFrPg63HwE5w4VaMYrbnzi', '2023-05-21 20:07:41.179404', NULL);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 11, true);


--
-- Name: urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.urls_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 27, true);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: urls urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: sessions fk_sessions_users; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_users FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: urls fk_urls_users; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT fk_urls_users FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--


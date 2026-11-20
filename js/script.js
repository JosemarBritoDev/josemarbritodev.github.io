document.addEventListener('DOMContentLoaded', () => {
    // 1. MENU MOBILE
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. AVATAR INTERATIVO BRITOSBOT (TODOS OS SISTEMAS + LINKS OFICIAIS)
    const widget = document.getElementById('avatar-widget');
    const trigger = document.getElementById('avatar-trigger');
    const panel = document.getElementById('avatar-panel');
    const closeBtn = document.getElementById('avatar-close');
    const backdrop = document.getElementById('avatar-backdrop');
    const callout = document.getElementById('avatar-callout');
    const calloutClose = document.getElementById('callout-close');

    const speechTitle = document.getElementById('speech-title');
    const speechText = document.getElementById('speech-text');
    const siteCta = document.getElementById('avatar-site-cta');
    const whatsappCta = document.getElementById('avatar-whatsapp-cta');
    const topicPills = document.querySelectorAll('.topic-pill');
    const detailTabs = document.querySelectorAll('.detail-tab');

    let currentTopic = 'intro';
    let currentAspect = 'oque';
    let typingInterval = null;

    const WHATSAPP_BASE = 'https://wa.me/5511972646617?text=';

    const knowledgeBase = {
        intro: {
            siteUrl: null,
            whatsappMsg: 'Olá Josemar! Estava navegando no site BritosCode.tech e gostaria de conhecer melhor suas soluções para minha empresa.',
            oque: {
                title: 'Bem-vindo à BritosCode.tech!',
                text: 'Eu sou o BritosBot. Desenvolvemos ERPs completos, plataformas SaaS sob medida, automações em Python e infraestrutura de redes corporativas. Toque em um sistema acima para explorar!'
            },
            como: {
                title: 'Engenharia Ponta a Ponta',
                text: 'Unimos desenvolvimento Full Stack moderno (Next.js, TypeScript, Python, Django e PostgreSQL) com engenharia de redes, Docker e Cloud para entregar sistemas rápidos, seguros e escaláveis.'
            },
            contratar: {
                title: 'Como implantar na sua empresa',
                text: 'Você pode licenciar nossos sistemas SaaS prontos ou solicitar um projeto sob medida. Toque no botão verde abaixo para falar direto com o Josemar no WhatsApp e agendar uma demonstração.'
            }
        },
        matcom: {
            siteUrl: 'https://matcom-britoscode.vercel.app/',
            siteLabel: 'Site Oficial',
            whatsappMsg: 'Olá Josemar! Vi a apresentação do MatCom ERP no site e gostaria de saber como implantar na minha loja de materiais de construção.',
            oque: {
                title: 'MatCom — ERP para Materiais de Construção',
                text: 'Sistema completo de gestão para lojas de construção. Integra frente de caixa (PDV), orçamentos, pedidos, estoque, compras, financeiro com DRE e emissão fiscal SEFAZ, SPED e importação de XML.'
            },
            como: {
                title: 'Arquitetura SaaS White-Label do MatCom',
                text: 'Construído com Next.js 15, TypeScript, Prisma ORM e PostgreSQL no Supabase, hospedado na Vercel. Possui isolamento multi-tenant, identidade visual personalizável por loja e suporte PWA para celulares e tablets.'
            },
            contratar: {
                title: 'Implantação Rápida na Nuvem',
                text: 'Por ser 100% em nuvem (SaaS), sua loja não precisa investir em servidores locais. Acesse o site oficial do MatCom no botão roxo abaixo ou fale conosco pelo WhatsApp para implantar na sua loja!'
            }
        },
        bchealth: {
            siteUrl: 'https://clinica-saas-5isy.onrender.com/',
            siteLabel: 'Site Oficial',
            whatsappMsg: 'Olá Josemar! Vi o BC Health no site e gostaria de conhecer melhor para gestão da minha clínica.',
            oque: {
                title: 'BC Health — Gestão Clínica & Workflow',
                text: 'Plataforma criada para clínicas médicas e consultórios organizarem recepção, agenda, fluxo visual de pacientes em quadro Kanban, controle de planos e comunicação integrada via WhatsApp.'
            },
            como: {
                title: 'Stack & Segurança do BC Health',
                text: 'Desenvolvido com Next.js 16, TypeScript, Prisma ORM e PostgreSQL no Supabase, hospedado no Render com controle dinâmico de permissões por plano e integração de cobranças via Asaas.'
            },
            contratar: {
                title: 'BC Health na sua Clínica',
                text: 'Implantamos o ambiente exclusivo da sua clínica com perfis de acesso para recepção, médicos e gestão. Acesse o site oficial no botão roxo abaixo ou solicite uma demonstração no WhatsApp!'
            }
        },
        atosoffice: {
            siteUrl: 'https://https://www.atosoffice.com/',
            siteLabel: 'Site Oficial',
            whatsappMsg: 'Olá Josemar! Vi o AtosOffice no site e gostaria de conhecer melhor para gestão da nossa igreja.',
            oque: {
                title: 'AtosOffice — Gestão Inteligente para Igrejas',
                text: 'Plataforma completa para administração eclesiástica. Integra estrutura hierárquica entre matriz e congregações, cadastro de membros, tesouraria (dízimos e ofertas), agendas pastorais, biblioteca e portal PWA para membros.'
            },
            como: {
                title: 'Arquitetura SaaS do AtosOffice',
                text: 'Desenvolvido com Next.js, TypeScript, Prisma ORM e PostgreSQL no Supabase, hospedado na Vercel com isolamento multi-tenant, controle hierárquico de permissões e experiência PWA para celular.'
            },
            contratar: {
                title: 'AtosOffice na sua Igreja',
                text: 'Ativamos o ambiente exclusivo da sua igreja ou ministério em poucos passos, sem necessidade de servidores locais. Acesse o site oficial no botão roxo abaixo ou fale conosco no WhatsApp!'
            }
        },
        bcmodas: {
            siteUrl: null,
            whatsappMsg: 'Olá Josemar! Tenho interesse no BCModas ERP para gestão de confecção e produção.',
            oque: {
                title: 'BCModas — ERP Industrial & E-commerce',
                text: 'Criado para confecções e estamparia/bordados controlarem desde o pedido do cliente até as ordens de produção fabril, estoque de insumos e vendas online.'
            },
            como: {
                title: 'Infraestrutura Containerizada',
                text: 'Desenvolvido em Python com Django e painel moderno Unfold, banco PostgreSQL, proxy reverso Nginx com SSL e orquestrado via Docker Compose em servidor VPS na Oracle Cloud.'
            },
            contratar: {
                title: 'Leve o BCModas para sua Fábrica',
                text: 'Adaptamos o fluxo de ordens de produção e etapas de fabricação conforme a realidade da sua confecção. Entre em contato pelo WhatsApp!'
            }
        },
        bclivros: {
            siteUrl: null,
            whatsappMsg: 'Olá Josemar! Achei muito interessante o BC Livros e automações em Python. Gostaria de conversar sobre um projeto.',
            oque: {
                title: 'BC Livros — Biblioteca & Ingestão de Dados',
                text: 'Plataforma web e robô de automação que lê acervos inteiros na nuvem, extrai metadados automaticamente e organiza centenas de documentos e e-books para leitura e busca rápida.'
            },
            como: {
                title: 'Automação com Python & Google Drive API',
                text: 'Utiliza scripts Python integrados à API do Google Drive para processar arquivos em lote, estruturar registros em banco SQL e disponibilizar em interface web responsiva.'
            },
            contratar: {
                title: 'Automação Sob Medida para seus Dados',
                text: 'Se sua empresa perde horas organizando planilhas, PDFs ou arquivos na nuvem, criamos robôs em Python sob medida para automatizar esse fluxo.'
            }
        },
        infra: {
            siteUrl: null,
            whatsappMsg: 'Olá Josemar! Preciso de consultoria em redes, firewall ou servidores para minha empresa.',
            oque: {
                title: 'Redes Corporativas, Firewall & Monitoramento',
                text: 'Projetamos e reestruturamos redes empresariais com segmentação VLAN, VPNs seguras entre matriz e filiais, bloqueio de ameaças e monitoramento 24/7.'
            },
            como: {
                title: 'Tecnologias de Infraestrutura',
                text: 'Trabalhamos com roteadores MikroTik RouterOS, firewalls FortiGate, virtualização KVM/Proxmox VE, containers Docker em Linux e dashboards em tempo real com Zabbix e Grafana.'
            },
            contratar: {
                title: 'Consultoria e Implantação de TI',
                text: 'Realizamos diagnóstico completo da sua rede ou servidor e entregamos a documentação e monitoramento ativo. Fale direto com o Josemar!'
            }
        }
    };

    function stopTypingAnimation() {
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        widget.classList.remove('is-typing');
    }

    function typeWriterText(fullText) {
        stopTypingAnimation();
        speechText.textContent = '';
        widget.classList.add('is-typing');

        let index = 0;
        typingInterval = setInterval(() => {
            speechText.textContent += fullText.charAt(index);
            index++;
            if (index >= fullText.length) {
                stopTypingAnimation();
            }
        }, 16);
    }

    function updateAvatarView() {
        const topicData = knowledgeBase[currentTopic];
        const aspectData = topicData[currentAspect];

        speechTitle.textContent = aspectData.title;
        whatsappCta.href = WHATSAPP_BASE + encodeURIComponent(topicData.whatsappMsg);

        if (topicData.siteUrl) {
            siteCta.href = topicData.siteUrl;
            siteCta.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${topicData.siteLabel || 'Acessar Site Oficial'}`;
            siteCta.classList.remove('hidden');
        } else {
            siteCta.classList.add('hidden');
        }

        topicPills.forEach(pill => {
            pill.classList.toggle('active', pill.dataset.topic === currentTopic);
            if (pill.dataset.topic === currentTopic) {
                pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });

        detailTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.aspect === currentAspect);
        });

        if (panel.classList.contains('open')) {
            typeWriterText(aspectData.text);
        }
    }

    function openPanel() {
        panel.classList.add('open');
        widget.classList.add('panel-open');
        panel.setAttribute('aria-hidden', 'false');
        if (callout) callout.classList.add('hidden');
        if (backdrop && window.innerWidth <= 768) {
            backdrop.classList.add('visible');
        }
        updateAvatarView();
    }

    function closePanel() {
        panel.classList.remove('open');
        widget.classList.remove('panel-open');
        panel.setAttribute('aria-hidden', 'true');
        if (backdrop) backdrop.classList.remove('visible');
        stopTypingAnimation();
    }

    trigger.addEventListener('click', () => {
        if (panel.classList.contains('open')) {
            closePanel();
        } else {
            openPanel();
        }
    });

    closeBtn.addEventListener('click', closePanel);
    if (backdrop) backdrop.addEventListener('click', closePanel);

    if (calloutClose) {
        calloutClose.addEventListener('click', (e) => {
            e.stopPropagation();
            callout.classList.add('hidden');
        });
    }

    topicPills.forEach(pill => {
        pill.addEventListener('click', () => {
            currentTopic = pill.dataset.topic;
            currentAspect = 'oque';
            updateAvatarView();
        });
    });

    detailTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentAspect = tab.dataset.aspect;
            updateAvatarView();
        });
    });
});
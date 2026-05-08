export type Language = 'en' | 'ru';

export const translations = {
  en: {
    nav: ['Services', 'About Us', 'Reviews'],
    hero: {
      titleLines: ['Silk Beauty.', 'Perfection.'],
      subtitle: 'The finest premium cosmetology and beauty salon in Pyatigorsk.',
      cta: 'Book an Appointment',
      bgImage: '/hero.png'
    },
    assembly: {
      sectionNum: '01',
      headlineMain: 'Our Vision:',
      headlineSub: 'A Sanctum of Beauty.',
      paragraphs: [
        'Silk Beauty is not just a salon. We are a team of expert cosmetologists and stylists unified by a single ethos: highlighting your natural beauty with precision.',
        'We believe that true luxury lies in details. By using the finest products and techniques, we construct the foundation of your confidence.'
      ],
      image: '/port1.png',
      imageCaption: 'Aesthetic Integrity'
    },
    portfolio: {
      title: 'Our Services',
      subtitle: 'Premium Cosmetology 2026',
      projects: [
        {
          id: 1,
          title: 'Advanced Cosmetology',
          description: 'A complete range of facial treatments, preserving your youthful soul through innovative aesthetic medicine.',
          image: '/port1.png',
          alignment: 'left'
        },
        {
          id: 2,
          title: 'Premium Styling',
          description: 'Precision hair styling and coloring using original artisanal techniques and modern stabilization.',
          image: '/port2.png',
          alignment: 'right'
        },
        {
          id: 3,
          title: 'Spa & Wellness',
          description: 'A private acoustic gallery of relaxation. A masterclass in thermal mass and raw material texture for your body.',
          image: '/port3.png',
          alignment: 'left'
        }
      ],
      cta: 'View Details'
    },
    journal: {
      title: 'The Beauty Journal',
      description: 'Curated insights on beauty, aesthetics, and the philosophy of care delivered quarterly to your sanctum.',
      placeholder: 'Enter your email',
      subscribe: 'Subscribe'
    },
    footer: {
      brand: 'Silk Beauty',
      description: 'Preserving the silent weight of beauty through precision. The best salon in Pyatigorsk.',
      labels: {
        directory: 'Directory',
        network: 'Network',
        headquarters: 'Headquarters'
      },
      socials: ['Instagram', 'VKontakte', 'Telegram'],
      nav: ['Services', 'About', 'Reviews', 'Contact'],
      address: 'Pyatigorsk, Russia',
      contact: '+7 (999) 000-00-00\nhello@silkbeauty.ru',
      copyright: 'Silk Beauty. All rights reserved.',
      links: ['Privacy', 'Terms', 'Credits']
    }
  },
  ru: {
    nav: ['Услуги', 'О Нас', 'Отзывы'],
    hero: {
      titleLines: ['Silk Beauty.', 'Совершенство.'],
      subtitle: 'Лучший премиальный салон красоты и косметологии в Пятигорске.',
      cta: 'Записаться на прием',
      bgImage: '/hero.png'
    },
    assembly: {
      sectionNum: '01',
      headlineMain: 'Наш Подход:',
      headlineSub: 'Святилище Красоты.',
      paragraphs: [
        'Silk Beauty — это не просто салон. Мы — команда экспертов-косметологов и стилистов, объединенных единым духом: точным подчеркиванием вашей естественной красоты.',
        'Мы верим, что истинная роскошь кроется в деталях. Используя лучшие продукты и техники, мы закладываем фундамент вашей уверенности.'
      ],
      image: '/port1.png',
      imageCaption: 'Эстетическая Целостность'
    },
    portfolio: {
      title: 'Наши Услуги',
      subtitle: 'Премиальная Косметология',
      projects: [
        {
          id: 1,
          title: 'Аппаратная Косметология',
          description: 'Полный спектр процедур для лица. Сохранение молодости с помощью инновационной эстетической медицины.',
          image: '/port1.png',
          alignment: 'left'
        },
        {
          id: 2,
          title: 'Премиальный Стайлинг',
          description: 'Точные стрижки и окрашивание с использованием эксклюзивных техник и современных красителей.',
          image: '/port2.png',
          alignment: 'right'
        },
        {
          id: 3,
          title: 'Spa & Relax',
          description: 'Приватная галерея релаксации. Восстановление вашего тела и разума.',
          image: '/port3.png',
          alignment: 'left'
        }
      ],
      cta: 'Подробнее'
    },
    journal: {
      title: 'Журнал Красоты',
      description: 'Отобранные инсайты о красоте, эстетике и философии ухода, доставляемые ежеквартально в ваше святилище.',
      placeholder: 'Введите ваш email',
      subscribe: 'Подписаться'
    },
    footer: {
      brand: 'Silk Beauty',
      description: 'Сохраняем вашу красоту через профессионализм и точность. Лучший салон Пятигорска.',
      labels: {
        directory: 'Каталог',
        network: 'Сеть',
        headquarters: 'Локация'
      },
      socials: ['Instagram', 'ВКонтакте', 'Telegram'],
      nav: ['Услуги', 'О Нас', 'Отзывы', 'Контакты'],
      address: 'Пятигорск, Россия',
      contact: '+7 (999) 000-00-00\nhello@silkbeauty.ru',
      copyright: 'Silk Beauty. Все права защищены.',
      links: ['Конфиденциальность', 'Термины', 'Кредиты']
    }
  }
};

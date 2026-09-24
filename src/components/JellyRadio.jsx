import { motion } from 'motion/react';
import './JellyRadio.css';

export default function JellyRadio({
  items = [],
  value,
  onChange,
}) {
  return (
    <div className="jelly-radio">
      {items.map((item) => {
        const data =
          typeof item === 'string'
            ? { value: item, label: item }
            : item;

        const active = value === data.value;

        return (
          <motion.button
            key={data.value}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: active ? 1.08 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 580,
              damping: 20,
            }}
            className={active ? 'active' : ''}
            onClick={() => onChange?.(data.value)}
          >
            {data.label}
          </motion.button>
        );
      })}
    </div>
  );
}
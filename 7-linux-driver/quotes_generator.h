#ifndef QUOTES_GENERATOR_H
#define QUOTES_GENERATOR_H

#include "quotes_data.h"

void quotes_generator_init(void);
void quotes_generator_update(void);
void quotes_generator_generate_quote(struct financial_instrument *inst, struct financial_quote *quote);

#endif /* QUOTES_GENERATOR_H */
